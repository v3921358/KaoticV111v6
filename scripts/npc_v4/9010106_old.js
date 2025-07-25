/*
 This file is part of the OdinMS Maple Story Server
 Copyright (C) 2008 Patrick Huy <patrick.huy@frz.cc>
 Matthias Butz <matze@odinms.de>
 Jan Christian Meyer <vimes@odinms.de>
 
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
var status = 0;
var ticketId = 5220000;
var amount = 30000;
var reward = 5220020;
var rewamount = 1;
var exp = 2500;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0 && type > 0) {
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        if (status == 0) {
            cm.sendYesNo("Do you have " + amount + " #i" + ticketId + "#?.");
        } else if (status == 1) {
            if (amount > 0) {
                if (cm.haveItem(ticketId, amount)) {
                    cm.gainItem(ticketId, -amount);
                    cm.gainItem(reward, rewamount);
                    cm.getPlayer().gainExp(exp, true, true, true);
                    cm.sendOk("You have gained " + rewamount + " Credits.");
                } else {
                    cm.sendOk("You currently do not have enough #i" + ticketId + "#.");
                }
            }
            cm.dispose();
        } else {
            cm.dispose();
        }
    }
}


