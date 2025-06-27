/*
 This file is part of the OdinMS Maple Story Server
 Copyright (C) 2008 ~ 2010 Patrick Huy <patrick.huy@frz.cc> 
 Matthias Butz <matze@odinms.de>
 Jan Christian Meyer <vimes@odinms.de>

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License version 3
 as published by the Free Software Foundation. You may not use, modify
 or distribute this program under any other version of the
 GNU Affero General Public License.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package handling.channel.handler;

import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;
import java.util.HashMap;

import client.MapleCharacter;
import client.MapleClient;

import client.Skill;
import client.SkillFactory;
import handling.world.World;
import handling.world.guild.*;
import server.MapleStatEffect;
import server.TimerManager;
import tools.packet.CField;
import tools.Pair;
import tools.data.input.SeekableLittleEndianAccessor;
import tools.packet.CWvsContext.GuildPacket;

public class GuildHandler {

    private static final Map<String, Pair<Integer, Long>> invited = new HashMap<String, Pair<Integer, Long>>();
    private static long nextPruneTime = System.currentTimeMillis() + 30 * 1000;

    public static final void DenyGuildRequest(final String from, final MapleClient c) {
        final MapleCharacter cfrom = c.getChannelServer().getPlayerStorage().getCharacterByName(from);
        if (cfrom != null && invited.containsKey(c.getPlayer().getName())) {
            cfrom.getClient().announce(GuildPacket.denyGuildInvitation(c.getPlayer().getName()));
            cancelInvite(c);
        }
    }

    public static void cancelInvite(final MapleClient c) {
        if (invited.containsKey(c.getPlayer().getName())) {
            invited.remove(c.getPlayer().getName());
        }
    }

    public static final boolean hasGuildInvitation(MapleCharacter player) {
        return invited.containsKey(player.getName());
    }

    private static final boolean isGuildNameAcceptable(final String name) {
        if (name.length() < 3 || name.length() > 12) {
            return false;
        }
        for (int i = 0; i < name.length(); i++) {
            if (!Character.isLowerCase(name.charAt(i)) && !Character.isUpperCase(name.charAt(i))) {
                return false;
            }
        }
        return true;
    }

    private static final void respawnPlayer(final MapleCharacter mc) {
        if (mc.getMap() == null) {
            return;
        }
        mc.getMap().broadcastMessage(CField.loadGuildName(mc));
        mc.getMap().broadcastMessage(CField.loadGuildIcon(mc));
    }

    public static final void Guild(final SeekableLittleEndianAccessor slea, final MapleClient c) {
        final long currentTime = System.currentTimeMillis();
        switch (slea.readByte()) { //AFTERSHOCK: most are +1
            case 0x02: // Create guild
                if (c.getPlayer().getGuildId() > 0) {
                    c.getPlayer().dropMessage(1, "You cannot create a new Guild while in one.");
                    return;
                } else if (c.getPlayer().getMeso() < 25000) {
                    c.getPlayer().dropMessage(1, "You do not have enough mesos to create a Guild.");
                    return;
                }
                final String guildName = slea.readMapleAsciiString();

                if (!isGuildNameAcceptable(guildName)) {
                    c.getPlayer().dropMessage(1, "The Guild name you have chosen is not accepted.");
                    return;
                }
                int guildId = World.Guild.createGuild(c.getPlayer().getId(), guildName);
                if (guildId == 0) {
                    c.getPlayer().dropMessage(1, "Please try again.");
                    return;
                }
                c.getPlayer().gainMeso(-25000, true, true);
                c.getPlayer().setGuildId(guildId);
                c.getPlayer().setGuildRank((byte) 1);
                c.getPlayer().saveGuildStatus();
                c.getPlayer().finishAchievement(35);
                World.Guild.setGuildMemberOnline(c.getPlayer().getMGC(), true, c.getChannel());
                //c.announce(GuildPacket.showGuildInfo(c.getPlayer()));
                c.announce(GuildPacket.newGuildInfo(c.getPlayer()));
                World.Guild.gainGP(c.getPlayer().getGuildId(), 500, c.getPlayer().getId());
                c.getPlayer().dropMessage(1, "You have successfully created a Guild.");
                c.getPlayer().getMap().updateObject(c.getPlayer());
                //respawnPlayer(c.getPlayer());
                break;
            case 0x05: // invitation
                if (c.getPlayer().getGuildId() <= 0 || c.getPlayer().getGuildRank() > 2) { // 1 == guild master, 2 == jr
                    return;
                }
                String name = slea.readMapleAsciiString();
                if (invited.containsKey(name)) {
                    if (invited.get(name).right > currentTime) {
                        invited.remove(name);
                    } else {
                        c.getPlayer().dropMessage(5, "The player is currently handling an invitation.");
                        return;
                    }
                }
                final MapleGuildResponse mgr = MapleGuild.sendInvite(c, name);

                if (mgr != null) {
                    c.announce(mgr.getPacket());
                } else {
                    c.getPlayer().dropMessage("You have invited " + name + " to your guild.");
                    invited.put(name, new Pair<Integer, Long>(c.getPlayer().getGuildId(), currentTime + (30000))); //20 mins expire
                    TimerManager.getInstance().schedule(() -> {
                        if (invited.containsKey(name)) {
                            invited.remove(name);
                            if (c.getPlayer() != null) {
                                c.getPlayer().dropMessage(5, name + "'s guild invite has expired.");
                            }
                        }
                    }, 30000);
                }
                break;
            case 0x06: // accepted guild invitation
                if (!invited.containsKey(c.getPlayer().getName())) {
                    c.getPlayer().dropMessage("Guild invite has expired.");
                    return;
                }
                if (c.getPlayer().getGuildId() > 0) {
                    return;
                }
                guildId = slea.readInt();
                int cid = slea.readInt();

                if (cid != c.getPlayer().getId()) {
                    return;
                }
                name = c.getPlayer().getName();
                Pair<Integer, Long> gid = invited.get(c.getPlayer().getName());
                if (gid != null && guildId == gid.left) {
                    c.getPlayer().setGuildId(guildId);
                    c.getPlayer().setGuildRank((byte) 5);
                    int s = World.Guild.addGuildMember(c.getPlayer().getMGC());
                    if (s == 0) {
                        c.getPlayer().dropMessage(1, "The Guild you are trying to join is already full.");
                        c.getPlayer().setGuildId(0);
                        return;
                    }
                    c.announce(GuildPacket.showGuildInfo(c.getPlayer()));
                    final MapleGuild gs = World.Guild.getGuild(guildId);
                    for (byte[] pack : World.Alliance.getAllianceInfo(gs.getAllianceId(), true)) {
                        if (pack != null) {
                            c.announce(pack);
                        }
                    }
                    c.getPlayer().saveGuildStatus();
                    respawnPlayer(c.getPlayer());
                    c.getPlayer().finishAchievement(35);
                    invited.remove(name);
                }
                break;
            case 0x07: // leaving
                cid = slea.readInt();
                name = slea.readMapleAsciiString();

                if (cid != c.getPlayer().getId() || !name.equals(c.getPlayer().getName()) || c.getPlayer().getGuildId() <= 0) {
                    return;
                }
                World.Guild.leaveGuild(c.getPlayer().getMGC());
                c.announce(GuildPacket.showGuildInfo(null));
                break;
            case 0x08: // Expel
                cid = slea.readInt();
                name = slea.readMapleAsciiString();

                if (c.getPlayer().getGuildRank() > 2 || c.getPlayer().getGuildId() <= 0) {
                    return;
                }
                World.Guild.expelMember(c.getPlayer().getMGC(), name, cid);
                break;
            case 0x0e: // Guild rank titles change
                if (c.getPlayer().getGuildId() <= 0 || c.getPlayer().getGuildRank() != 1) {
                    return;
                }
                String ranks[] = new String[5];
                for (int i = 0; i < 5; i++) {
                    ranks[i] = slea.readMapleAsciiString();
                }

                World.Guild.changeRankTitle(c.getPlayer().getGuildId(), ranks);
                break;
            case 0x0f: // Rank change
                cid = slea.readInt();
                byte newRank = slea.readByte();

                if ((newRank <= 1 || newRank > 5) || c.getPlayer().getGuildRank() > 2 || (newRank <= 2 && c.getPlayer().getGuildRank() != 1) || c.getPlayer().getGuildId() <= 0) {
                    return;
                }

                World.Guild.changeRank(c.getPlayer().getGuildId(), cid, newRank);
                break;
            case 0x10: // guild emblem change
                if (c.getPlayer().getGuildId() <= 0 || c.getPlayer().getGuildRank() != 1) {
                    return;
                }

                if (c.getPlayer().getMeso() < 1500000) {
                    c.getPlayer().dropMessage(1, "You do not have enough mesos to create an emblem.");
                    return;
                }
                final short bg = slea.readShort();
                final byte bgcolor = slea.readByte();
                final short logo = slea.readShort();
                final byte logocolor = slea.readByte();

                World.Guild.setGuildEmblem(c.getPlayer().getGuildId(), bg, bgcolor, logo, logocolor);

                c.getPlayer().gainMeso(-1500000, true, true);
                respawnPlayer(c.getPlayer());
                break;
            case 0x11: // guild notice change
                final String notice = slea.readMapleAsciiString();
                if (notice.length() > 100 || c.getPlayer().getGuildId() <= 0 || c.getPlayer().getGuildRank() > 2) {
                    return;
                }
                World.Guild.setGuildNotice(c.getPlayer().getGuildId(), notice);
                break;
            case 0x1d: //guild skill purchase
                Skill skilli = SkillFactory.getSkill(slea.readInt());
                if (c.getPlayer().getGuildId() <= 0 || skilli == null || skilli.getId() < 91000000) {
                    return;
                }
                int eff = World.Guild.getSkillLevel(c.getPlayer().getGuildId(), skilli.getId()) + 1;
                if (eff > skilli.getMaxLevel()) {
                    return;
                }
                final MapleStatEffect skillid = skilli.getEffect(eff);
                if (skillid.getReqGuildLevel() <= 0) {
                    /*
                    if (c.getPlayer().getBank() >= skillid.getPrice()) {
                        if (World.Guild.purchaseSkill(c.getPlayer().getGuildId(), skillid.getSourceId(), c.getPlayer().getName(), c.getPlayer().getId())) {
                            //c.getPlayer().updateBank(-skillid.getPrice());
                        }
                    } else {
                        c.getPlayer().dropMessage(1, "You currently do not have enough mesos");
                    }
                     */
                    return;
                }

                World.Guild.purchaseSkill(c.getPlayer().getGuildId(), skillid.getSourceId(), c.getPlayer().getName(), c.getPlayer().getId());
                break;
            case 0x1e: //guild skill activation
                skilli = SkillFactory.getSkill(slea.readInt());
                if (c.getPlayer().getGuildId() <= 0 || skilli == null) {
                    return;
                }
                eff = World.Guild.getSkillLevel(c.getPlayer().getGuildId(), skilli.getId());
                if (eff <= 0) {
                    return;
                }
                final MapleStatEffect skillii = skilli.getEffect(eff);
                if (skillii.getReqGuildLevel() < 0 || c.getPlayer().getMeso() < skillii.getExtendPrice()) {
                    return;
                }
                if (World.Guild.activateSkill(c.getPlayer().getGuildId(), skillii.getSourceId(), c.getPlayer().getName())) {
                    c.getPlayer().gainMeso(-skillii.getExtendPrice(), true);
                }
                break;
            case 0x1f: //guild leader change
                /*
                 cid = slea.readInt();
                 if (c.getPlayer().getGuildId() <= 0 || c.getPlayer().getGuildRank() > 1) {
                 return;
                 }
                 World.Guild.setGuildLeader(c.getPlayer().getGuildId(), cid);
                 */
                c.getPlayer().dropMessage("Changing guild leaders is disabled for now.");
                break;
        }
    }
}
