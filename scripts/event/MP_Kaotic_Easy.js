/*
 This file is part of the HeavenMS MapleStory Server
 Copyleft (L) 2016 - 2018 RonanLana
 
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as
 published by the Free Software Foundation version 3 as published by
 the Free Software Foundation. You may not use, modify or distribute
 this program under any other version of the GNU Affero General Public
 License.
 
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.
 
 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @author: Ronan
 * @event: Vs Bergamot
 */

var exitMap = 870000010;
var baseMap = 952000000;

var eventTime = 30;     // 10 minutes

var lobbyRange = [0, 0];
//bossid = 8641059

function init() {

}

function setLobbyRange() {
    return lobbyRange;
}

function getEligibleParty(party) {      //selects, from the given party, the team that is allowed to attempt this event
}

function setup(player, level, scale) {
    var eim = em.newInstance(player, "MP_Kaotic_" + scale + "_" + player.getName(), true);
    eim.setIntProperty("exit", player.getMapId());
    if (scale >= 0 && scale < 5) {
        eim.setIntProperty("scale", scale);
        eim.setIntProperty("base", 952000000);
    } else if (scale >= 5 && scale < 11) {
        eim.setIntProperty("scale", scale - 5);
        eim.setIntProperty("base", 953000000);
    } else {
        eim.setIntProperty("scale", scale - 11);
        eim.setIntProperty("base", 954000000);
    }
    eim.setIntProperty("level", level);
    eim.setIntProperty("zone", eim.getIntProperty("scale"));
    eim.setIntProperty("finished", 0);
    eim.setIntProperty("reward", 10);
    eim.setIntProperty("exp", 40);
    eim.setIntProperty("rank", 20);
    eim.setIntProperty("baseAch", 270);
    eim.setIntProperty("ach", scale);
    eim.setIntProperty("coin", 25);
    eim.setIntProperty("kaotic", 1);

    eim.setIntProperty("minMapId", eim.getIntProperty("base") + (eim.getIntProperty("scale") * 10000));
    eim.setIntProperty("maxMapId", eim.getIntProperty("base") + 500 + (eim.getIntProperty("scale") * 10000));
    eim.setIntProperty("entryMap", eim.getIntProperty("base") + (eim.getIntProperty("scale") * 10000));

    for (var i = 0; i < 6; i++) {
        var mapid = eim.getIntProperty("base") + (eim.getIntProperty("scale") * 10000) + (i * 100);
        var map = eim.getMapInstance(mapid);
        eim.setMapInfo(map, exitMap);
        map.parkKaoticSpawn(level, 5);
    }
    eim.startEventTimer(eventTime * 60000);
    eim.setIntProperty("start", 1);
    return eim;
}

function playerEntry(eim, player) {
    var map = eim.getMapInstance(eim.getIntProperty("entryMap"));
    player.changeMap(map, map.getPortal(0));
}

function scheduledTimeout(eim) {
    eim.exitParty(eim.getIntProperty("exit"));
}

function playerUnregistered(eim, player) {
}

function playerExit(eim, player) {
    eim.exitPlayer(player, eim.getIntProperty("exit"));
}

function playerLeft(eim, player) {
    eim.exitPlayer(player, eim.getIntProperty("exit"));
}

function changedMap(eim, player, mapid) {
    if (mapid < eim.getIntProperty("minMapId") || mapid > eim.getIntProperty("maxMapId")) {
        eim.exitPlayer(player, eim.getIntProperty("exit"));
    } else {
        eim.warpEventTeam(mapid);
    }
}

function changedLeader(eim, leader) {
    eim.changeEventLeader(leader);
}

function playerDead(eim, player) {
}

function playerRevive(eim, player) { // player presses ok on the death pop up.
    eim.exitPlayer(player, eim.getIntProperty("exit"));
}

function playerDisconnected(eim, player) {
    eim.exitPlayer(player, eim.getIntProperty("exit"));
}

function leftParty(eim, player) {
    eim.exitPlayer(player, eim.getIntProperty("exit"));
}

function disbandParty(eim) {
    eim.exitParty(eim.getIntProperty("exit"));
}

function monsterValue(eim, mobId) {
    return 1;
}

function end(eim) {
    eim.exitParty(eim.getIntProperty("exit"));
}

function monsterKilled(mob, eim) {
}

function finish(eim) {
    eim.exitParty(eim.getIntProperty("exit"));
}

function allMonstersDead(eim) {
}

function cancelSchedule() {
}

function dispose(eim) {
}

function afterSetup(eim) {
}
