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

var status;
var level = 250;
var dp = 4310502;
var amount = 25;
var letter = 4009180;
var ach = new Array(0, 0, 0, 0, 0, 0);
var lvl = new Array(0, 2000, 3000, 4000, 5000, 7500);
var ppl = new Array(0, 1, 1, 2, 4, 4);

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
        status--;
    }
    if (status == 0) {
        if (cm.getPlayer().isGroup()) {
            if (cm.getPlayer().isLeader()) {
                var text = "Do you wish to take on Strongest challenge possible?\r\n";
                text += "#L1# Easy (#bT:20 - Lv.2000#k) (#rMin Players: 1#k)#l\r\n";
                text += "#L2# Normal (#bT:30 - Lv.3000#k) (#rMin Players: 1#k)#l\r\n";
                text += "#L3# Hard (#bT:40 - Lv.4000#k) (#rMin Players: 2#k)#l\r\n";
                text += "#L4# Super (#bT:50 - Lv.5000#k) (#rMin Players: 4#k)#l\r\n";
                text += "#L5# Kaotic (#bT:75 - Lv.7500#k) (#rMin Players: 4#k)#l\r\n";
                cm.sendSimple(text);
            } else {
                cm.sendOkS("Only the Party leader can speak to me.", 2);
            }
        } else {
            cm.sendOkS("I must take on this Challenge with a party.", 2);
        }
    } else if (status == 1) {
        var em = cm.getEventManager("BMPQ");
        if (em != null) {
            var stamina = 25;
            if (cm.getPlayer().getStamina() >= stamina) {
                if (em.getEligibleParty(cm.getPlayer(), lvl[selection], ppl[selection], 4)) {
                    if (!em.startPlayerInstance(cm.getPlayer(), lvl[selection], selection)) {
                        cm.sendOkS(5, "Someone is already attempting the PQ or your instance is currently being reseted. Try again in few seconds.", 2);
                    } else {
                        cm.getPlayer().removeStamina(stamina);
                    }
                } else {
                    cm.sendOkS("You cannot start this party quest yet, because either your party is not within the range limits, some of your party members are not eligible to attempt it or they are not in this map.", 2);
                }
            } else {
                cm.sendOkS("You currently do not have enough stamina to take on this challenge. Requires " + stamina + " Stamina.", 2);
            }
        } else {
            cm.sendOk("Event has already started, Please wait.");
        }
    }
}