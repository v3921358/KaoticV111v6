/*
 This file is part of the OdinMS Maple Story Server
 Copyright (C) 2008 Patrick Huy <patrick.huy@frz.cc>
 Matthias Butz <matze@odinms.de>
 Jan Christian Meyer <vimes@odinms.de>
 
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public              as
 published by the Free Software Foundation version 3 as published by
 the Free Software Foundation. You may not use, modify or distribute
 this program under any other version of the GNU Affero General Public
 .
 
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public              for more details.
 
 You should have received a copy of the GNU Affero General Public             
 along with this program.  If not, see <http://www.gnu.org/            s/>.
 */
/* 9000021 - Gaga
 BossRushPQ recruiter
 @author Ronan
 */

var bosses = new Array("Von Leon", "Empress", "Damien", "Magnus", "Lotus", "Lucid", "Will", "Hilla", "Darknell", "Crazy Will", "Ramuramu", "Atilla", "Aragami", "Butcher", "Asura", "Khan", "Riverson", "Capo", "Kobold");
var jobs = new Array("Any Warrior Job", "Any Mage Job", "Any Pirate Job", "Demon Slayer Job", "Mechanic Job", "Any Thief Job", "Ark (Thunder Breaker) Job", "Path Finder (Wind Archer) Job", "Kain (Dawn Warrior) Job", "Any Job");
//var ems = new Array("Von Leon", );
var tiers = new Array(11, 13, 15, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 45, 50);
var cost = new Array(1, 1, 2, 2, 2, 3, 3, 5, 5, 5, 5, 10, 10, 10, 15, 25, 25, 25, 50);
var level = new Array(250, 400, 875, 900, 1000, 1300, 1600, 2000, 2300, 2500, 3000, 3200, 3500, 3600, 3700, 3800, 4000, 4000, 5000);
var ach = new Array(51, 39, 70, 66, 65, 64, 50, 69, 180, 181, 400, 401, 402, 403, 404, 405, 406, 407, 408);
var status;
var battle = 0;
var lap = 0;
var trials = 0;
var triallevel = 0;
var emi;
var allowed = false;
var tier = 0;
var item = 4310502;
var status = 0;
var password = 0;
var boost = 0;
var option = 0;

function start() {
    password = cm.random(1000, 9999);
    cm.sendGetText("Please enter the 4 digit Code seen below: \r\n\ " + cm.botTest(password) + "\r\n");
}

function action(mode, type, selection) {
    if (mode < 0) {
    } else {
        if (mode == 0 && type > 0) {
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 1) {
            if (cm.getPlayer().isGroup()) {
                var count = Number(cm.getText());
                if (count == password) {
                    var text = "";

                    for (var i = 0; i < bosses.length; i++) {
                        var questtime = parseInt((3600 + (i * 600)) / 60);
                        text += "#L" + i + "##bKaotic " + bosses[i] + " - (T: " + tiers[i] + " - Lvl: " + level[i] + ")#k - (#rTime: " + questtime + "#k)#l\r\n";
                    }
                    boost = parseInt(cm.getPlayer().getLevelDataPerc(100) * 0.1);
                    if (boost < 1) {
                        boost = 1;
                    }
                    if (boost >= 25) {
                        boost = 25;
                        cm.sendSimpleS("Which Challenge would you like take on?\r\n\#rBosses are enhanced with Elwin Power\r\nto increase number of USE-ETC drops.\r\nEach boss has a cost in Donation Points.#k\r\n#bElwin Boost:#k #r" + boost + "x (#rMax#k)#k\r\n" + text + " ", 16);
                    } else {
                        cm.sendSimpleS("Which Challenge would you like take on?\r\n\#rBosses are enhanced with Elwin Power\r\nto increase number of USE-ETC drops.\r\nEach boss has a cost in Donation Points.#k\r\n#bElwin Boost:#k #r" + boost + "x#k\r\n" + text + " ", 16);
                    }


                } else {
                    cm.sendOkS("Wrong password.", 16);
                }
            } else {
                cm.sendOkS("These battles are for Group or Raid only.", 16);
            }
        } else if (status == 2) {
            option = selection;
            var questid = 8000 + option;
            if (cm.getPlayer().getQuestLock(questid) > 0) {
                cm.sendOk("Come see me after #b" + cm.secondsToString(cm.getPlayer().getQuestLock(questid)) + "#k \r\n\      to repeat this boss again.\r\n\ Quest ID: " + questid);
            } else {
                cm.sendYesNo("Are you sure you want to take on this boss?");
            }
        } else if (status == 3) {
            emi = bosses[option];
            tier = tiers[option];
            var questid = 8000 + option;
            var questtime = 3600 + (option * 600);
            if (cm.getPlayer().getQuestLock(questid) > 0) {
                cm.sendOk("Come see me after #b" + cm.secondsToString(cm.getPlayer().getQuestLock(questid)) + "#k \r\n\      to repeat this boss again.\r\n\ Quest ID: " + questid);
            } else {
                if (cm.getPlayer().isGroup()) {
                    var em = cm.getEventManager("BMT_" + emi);
                    if (em != null) {
                        if (em.getEligiblePartyAch(cm.getPlayer(), level[option], ach[option])) {
                            cm.getPlayer().setVar("boost", boost);
                            if (!em.startPlayerInstance(cm.getPlayer(), level[option], tier)) {
                                cm.sendOkS("Error with event, please report: event: BMT_" + emi, 16);
                            } else {
                                cm.getPlayer().setQuestLock(questid, questtime);
                                cm.dispose();
                            }
                        } else {
                            cm.sendOkS("You cannot start this party quest yet, because either your party is not in the range size, some of your party members are not eligible to attempt it or they are not in this map. Minimum requirements are: Level 2800+, 1+ Raid members.", 16);
                        }
                    } else {
                        cm.sendOkS("Event has already started, Please wait.", 16);
                    }
                } else {
                    cm.sendOkS("I must take on this Challenge with a Group.", 16);
                }
            }
        } else {
            cm.sendOkS("I must take on this Trial alone.", 16);
        }
    }
}