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
package handling.login;


import client.MapleClient;
import server.Timer.PingTimer;
import tools.packet.CWvsContext;
import tools.packet.LoginPacket;

public class LoginWorker {

    private static long lastUpdate = 0;

    public static void registerClient(final MapleClient c) {
        if (c == null) {
            return;
        }
        if (c.getlockAccount() > 0) {
            if (LoginServer.isAdminOnly() && !c.isGm() && !c.isLocalhost()) {
                c.announce(CWvsContext.serverNotice(1, "The server is currently set to Admin login only.\r\nWe are currently testing some issues.\r\nPlease try again later."));
                c.announce(LoginPacket.getLoginFailed(7));
                return;
            }
            /*
             if (System.currentTimeMillis() - lastUpdate > 600000) { // Update once every 10 minutes
             lastUpdate = System.currentTimeMillis();
             final Map<Integer, Integer> load = ChannelServer.getChannelLoad();
             int usersOn = 0;
             if (load == null || load.size() <= 0) { // In an unfortunate event that client logged in before load
             lastUpdate = 0;
             c.announce(LoginPacket.getLoginFailed(7));
             return;
             }
             final double loadFactor = 1200 / ((double) LoginServer.getUserLimit() / load.size());
             for (Entry<Integer, Integer> entry : load.entrySet()) {
             usersOn += entry.getValue();
             load.put(entry.getKey(), Math.min(1200, (int) (entry.getValue() * loadFactor)));
             }
             LoginServer.setLoad(load, usersOn);
             lastUpdate = System.currentTimeMillis();
             }
             */
            if (c.finishLogin() == 0) {
                c.setOnline(true);
                c.announce(LoginPacket.getAuthSuccessRequest(c));
            } else {
                c.announce(LoginPacket.getLoginFailed(7));
            }
        }
    }
}
