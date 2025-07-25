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
package server.maps;

import java.awt.Point;
import client.inventory.Item;
import client.MapleCharacter;
import client.MapleClient;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import tools.packet.CField;

public class MapleMapItem extends MapleMapObject {

    protected Item item;
    protected MapleMapObject dropper;
    protected int character_ownerid, meso = 0, questid = -1, map;
    protected byte type;
    protected boolean pickedUp = false, playerDrop, randDrop = false;
    protected long nextExpiry = 0, nextFFA = 0;
    private ReentrantLock lock = new ReentrantLock();
    public boolean disposed = false;
    public int oid = 0;
    public boolean personal = false;
    public short fh;

    public MapleMapItem(Item item, Point position, MapleMapObject dropper, int owner, byte type, boolean playerDrop, int mapid) {
        setPosition(position);
        this.item = item;
        this.dropper = dropper;
        this.oid = dropper.getObjectId();
        this.character_ownerid = owner;
        this.type = type;
        this.playerDrop = playerDrop;
        this.fh = (short) mapid;
    }

    public MapleMapItem(Item item, Point position, MapleMapObject dropper, int owner, byte type, boolean playerDrop, int questid, int mapid) {
        setPosition(position);
        this.item = item;
        this.dropper = dropper;
        this.oid = dropper.getObjectId();
        this.character_ownerid = owner;
        this.type = type;
        this.playerDrop = playerDrop;
        this.questid = questid;
        this.fh = (short) mapid;
    }

    public MapleMapItem(int meso, Point position, MapleMapObject dropper, int owner, byte type, boolean playerDrop, int mapid) {
        setPosition(position);
        this.item = null;
        this.dropper = dropper;
        this.oid = dropper.getObjectId();
        this.character_ownerid = owner;
        this.meso = meso;
        this.type = type;
        this.playerDrop = playerDrop;
        this.fh = (short) mapid;
    }

    public MapleMapItem(Point position, Item item, int mapid) {
        setPosition(position);
        this.item = item;
        this.character_ownerid = 0;
        this.type = 2;
        this.playerDrop = false;
        this.randDrop = true;
        this.fh = (short) mapid;
    }

    public MapleMapItem(Item item, byte type, Point position, int mapid) {
        setPosition(position);
        this.item = item;
        this.character_ownerid = 0;
        this.type = type;
        this.playerDrop = false;
        this.randDrop = true;
        this.fh = (short) mapid;
    }

    public final Item getItem() {
        return item;
    }

    public void setItem(Item z) {
        this.item = z;
    }
    
    public boolean isPersonal() {
        return personal;
    }
    
    public void setPersonal(boolean toggle) {
        personal = toggle;
    }

    public final int getQuest() {
        return questid;
    }
    
    public short getFh() {
        return fh;
    }

    public final int getItemId() {
        if (getMeso() > 0) {
            return meso;
        }
        return item.getItemId();
    }

    public final MapleMapObject getDropper() {
        return dropper;
    }
    
    public int getOwnerObjectId() {
        return oid;
    }

    public final int getOwner() {
        return character_ownerid;
    }

    public final int getMeso() {
        return meso;
    }

    public final boolean isPlayerDrop() {
        return playerDrop;
    }

    public final boolean isPickedUp() {
        return pickedUp;
    }

    public void setPickedUp(final boolean pickedUp) {
        this.pickedUp = pickedUp;
    }

    public byte getDropType() {
        return type;
    }

    public void setDropType(byte z) {
        this.type = z;
    }

    public final boolean isRandDrop() {
        return randDrop;
    }

    @Override
    public final MapleMapObjectType getType() {
        return MapleMapObjectType.ITEM;
    }

    @Override
    public void sendSpawnData(final MapleClient client) {
        if (questid <= 0 || client.getPlayer().getQuestStatus(questid) == 1) {
            client.announce(CField.dropItemFromMapObject(this, null, getTruePosition(), (byte) 2));
        }
    }

    @Override
    public void sendDestroyData(final MapleClient client) {
        client.announce(CField.removeItemFromMap(getObjectId(), 1, 0));
    }

    public Lock getLock() {
        return lock;
    }

    public void registerExpire(final long time) {
        nextExpiry = System.currentTimeMillis() + time;
    }

    public void registerFFA(final long time) {
        nextFFA = System.currentTimeMillis() + time;
    }

    public boolean shouldExpire(long now) {
        return !pickedUp && nextExpiry > 0 && nextExpiry < now;
    }

    public boolean shouldFFA(long now) {
        return !pickedUp && type < 2 && nextFFA > 0 && nextFFA < now;
    }

    public boolean hasFFA() {
        return nextFFA > 0;
    }

    public void expire(final MapleMap map) {
        pickedUp = true;
        disposed = true;
        map.broadcastMessage(CField.removeItemFromMap(getObjectId(), 0, 0));
        map.removeMapObject(this, MapleMapObjectType.ITEM);
    }
}
