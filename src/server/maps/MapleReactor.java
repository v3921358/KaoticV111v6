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

import java.awt.Rectangle;
import client.MapleClient;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.ScheduledFuture;
import scripting.ReactorScriptManager;
import server.Timer.MapTimer;
import tools.packet.CField;
import tools.Pair;

public class MapleReactor extends MapleMapObject {

    private int rid;
    private MapleReactorStats stats;
    private byte state = 0, facingDirection = 0;
    private int delay = -1;
    private MapleMap map;
    private String name = "";
    private boolean timerActive = false, alive = true, custom = false, lock = false;
    public Map<String, Boolean> rmFlags = new LinkedHashMap<String, Boolean>();
    public Map<String, Integer> rmInt = new LinkedHashMap<String, Integer>();
    private ScheduledFuture<?> schedulerTask = null;

    public MapleReactor(MapleReactorStats stats, int rid) {
        this.stats = stats;
        this.rid = rid;
    }

    public void setCustom(boolean c) {
        this.custom = c;
    }

    public boolean isCustom() {
        return custom;
    }

    public void setLock(boolean c) {
        this.lock = c;
    }

    public boolean isLocked() {
        return lock;
    }

    public final void setFacingDirection(final byte facingDirection) {
        this.facingDirection = facingDirection;
    }

    public final byte getFacingDirection() {
        return facingDirection;
    }

    public void setTimerActive(boolean active) {
        this.timerActive = active;
    }

    public boolean isTimerActive() {
        return timerActive;
    }

    public int getId() {
        return rid;
    }

    public int getReactorId() {
        return rid;
    }

    public void setState(byte state) {
        this.state = state;
    }

    public byte getState() {
        return state;
    }

    public boolean isAlive() {
        return alive;
    }

    public void setAlive(boolean alive) {
        this.alive = alive;
    }

    public void setDelay(int delay) {
        this.delay = delay;
    }

    public int getDelay() {
        return delay;
    }

    public void setRMFlag(String msg, boolean toggle) {
        rmFlags.put(msg, toggle);
    }

    public void setRMFlag(String msg, int value) {
        rmInt.put(msg, value);
    }

    public boolean getRMFlag(String msg) {
        return rmFlags.get(msg);
    }

    public int getRMVlaue(String msg) {
        return rmInt.get(msg);
    }

    @Override
    public MapleMapObjectType getType() {
        return MapleMapObjectType.REACTOR;
    }

    public int getReactorType() {
        return stats.getType(state);
    }

    public byte getTouch() {
        return stats.canTouch(state);
    }

    public void setMap(MapleMap map) {
        this.map = map;
    }

    public MapleMap getMap() {
        return map;
    }

    public Pair<Integer, Integer> getReactItem() {
        return stats.getReactItem(state);
    }

    public void sendDestroyData(MapleClient client) {
        client.announce(CField.destroyReactor(this));
    }

    public void sendSpawnData(MapleClient client) {
        client.announce(CField.spawnReactor(this));
    }

    public void forceStartReactor(MapleClient c) {
        ReactorScriptManager.getInstance().act(c, this);
    }

    public void forceHitReactor(final byte newState) {
        setState((byte) newState);
        setTimerActive(false);
        map.broadcastMessage(CField.triggerReactor(this, (short) 0));
    }

    //hitReactor command for item-triggered reactors
    public void hitReactor(MapleClient c) {
        hitReactor(0, (short) 0, c);
    }

    public void forceTrigger() {
        map.broadcastMessage(CField.triggerReactor(this, (short) 0));
    }

    public void delayedDestroyReactor(long delay) {
        MapTimer.getInstance().schedule(() -> {
            map.destroyReactor(getObjectId());
        }, delay);
    }

    public boolean getTask() {
        return schedulerTask != null;
    }

    public void delayedReactorState(final int state, final String msg, final int itemid, long delay) {
        if (schedulerTask == null) {
            schedulerTask = MapTimer.getInstance().schedule(() -> {
                if (!map.clear) {
                    forceHitReactor((byte) state);
                    map.broadcastMapMsg(msg, itemid);
                    if (schedulerTask != null) {
                        schedulerTask.cancel(false);
                        schedulerTask = null;
                    }
                }
            }, delay);
        }
    }

    public void hitReactor(int charPos, short stance, MapleClient c) {
        if (stats.getType(state) < 999 && stats.getType(state) != -1) {
            //type 2 = only hit from right (kerning swamp plants), 00 is air left 02 is ground left
            final byte oldState = state;
            if (!(stats.getType(state) == 2 && (charPos == 0 || charPos == 2))) { // next state
                state = stats.getNextState(state);

                if (stats.getNextState(state) == -1 || stats.getType(state) == 999) { //end of reactor
                    if ((stats.getType(state) < 100 || stats.getType(state) == 999) && delay > 0) { //reactor broken
                        map.destroyReactor(getObjectId());
                    } else { //item-triggered on final step
                        map.broadcastMessage(CField.triggerReactor(this, stance));
                    }
                    //if (rid > 200011) {
                    ReactorScriptManager.getInstance().act(c, this);
                    //}
                } else { //reactor not broken yet
                    boolean done = false;
                    map.broadcastMessage(CField.triggerReactor(this, stance)); //magatia is weird cause full beaker can be activated by gm hat o.o
                    if (state == stats.getNextState(state) || rid == 2618000 || rid == 2309000) { //current state = next state, looping reactor
                        if (rid > 200011) {
                            ReactorScriptManager.getInstance().act(c, this);
                        }
                        done = true;
                    }
                    if (stats.getTimeOut(state) > 0) {
                        if (!done && rid > 200011) {
                            ReactorScriptManager.getInstance().act(c, this);
                        }
                        scheduleSetState(state, oldState, stats.getTimeOut(state));
                    }
                }
            }
        }
    }

    public Rectangle getArea() {
        int height = stats.getBR().y - stats.getTL().y;
        int width = stats.getBR().x - stats.getTL().x;
        int origX = getTruePosition().x + stats.getTL().x;
        int origY = getTruePosition().y + stats.getTL().y;

        return new Rectangle(origX, origY, width, height);
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "Reactor " + getObjectId() + " of id " + rid + " at position " + getPosition().toString() + " state" + state + " type " + stats.getType(state);
    }

    public void delayedHitReactor(final MapleClient c, long delay) {
        MapTimer.getInstance().schedule(() -> {
            hitReactor(c);
        }, delay);
    }

    public void scheduleSetState(final byte oldState, final byte newState, long delay) {
        MapTimer.getInstance().schedule(() -> {
            if (MapleReactor.this.state == oldState) {
                forceHitReactor(newState);
            }
        }, delay);
    }
}
