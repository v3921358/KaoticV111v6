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
 * @Author Ronan
 * 3rd Job Event - Magician
 **/


var recruitMap = 66003;
var entryMap = 66003;
var exitMap = 870000100;

var eventMapId = 66003;

var startMap = 66003;
var endMap = 66003;

var minPlayers = 3, maxPlayers = 6;
var minLevel = 140, maxLevel = 255;

var eventTime = 10; //30 minutes
var lobbyRange = [0, 8];

function getEligibleParty(party) {      //selects, from the given party, the team that is allowed to attempt this event
    return eligible;
}

//setup --------------------------------------------------------------------

function setLobbyRange() {
    return lobbyRange;
}

function init() {
}

function setup(player, level, scale) {
    var eim = em.newInstance(player, "Pal_Park_" + player.getName(), true);
    eim.setExitMap(exitMap);
    eim.schedule("start", 5000);
    eim.setValue("finished", 0);
    eim.getMapInstance(eventMapId).killAllMonsters(false);
    eim.setMapInfo(eim.getMapInstance(eventMapId), exitMap);
    return eim;
}

function playerEntry(eim, player) {
    player.changeMap(eim.getMapInstance(eventMapId), 0);
}

function start(eim) {
    eim.broadcastMapMsg("[Oak] Destory the Balls. More balls will respawn every 5 seconds!", 5120205);
    eim.getMapInstance(eventMapId).spawnPalBallMap(false);
    eim.startEventTimer(eventTime * 60000);
    eim.schedule("balls", 2500);
}

function balls(eim) {
    if (eim.getValue("finished") == 0) {
        var map = eim.getMapInstance(eventMapId);
        if (map.countMonsters() == 0) {
            eim.broadcastMapMsg("[Oak] Have some more Balls!", 5120205);
            map.spawnPalBallMap(false);
        }
        eim.schedule("balls", 1000);
    }
}

//event --------------------------------------------------------------------

function finish(eim) {
    eim.exitParty(exitMap);
}

//timer ending --------------------------------------------------------------------
function scheduledTimeout(eim) {
    eim.setValue("finished", 1);
    eim.exitParty(exitMap);
}

//monsters--------------------------------------------------------------------

function monsterKilled(mob, eim) {
}

function monsterValue(eim, mobId) {
    return 1;
}

function allMonstersDead(eim) {
}

//player leave --------------------------------------------------------------------

function playerUnregistered(eim, player) {
}

function playerExit(eim, player) {
    eim.exitPlayer(player, exitMap);
}

function playerDisconnected(eim, player) {
    eim.exitPlayer(player, exitMap);
}

function clear(eim) {
}

function changedMap(eim, player, mapid) {
    if (mapid < startMap || mapid > endMap) {
        eim.exitPlayer(player, exitMap);
    }
}

function playerRevive(eim, player) { // player presses ok on the death pop up.
    eim.exitPlayer(player, exitMap);
}

function cancelSchedule() {
}

function dispose() {
}

function end(eim) {
    eim.exitParty(exitMap);
}


// ---------- FILLER FUNCTIONS ----------

function disbandParty(eim, player) {
}

function afterSetup(eim) {
}

function changedLeader(eim, leader) {
}

function leftParty(eim, player) {
}

function clearPQ(eim) {
}

