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
var status = 0;
var ticketId = 5062001;
var equip;
var equiplist;
var scroll = 0;
var scrollslot = 0;
var cost = 1;
var slotcount = 0;
var cube = 2583002;
var slots;
var slot = 0;
var safe = 0;
var pscroll = 0;
var usePScroll = 0;
var pot = 0;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
    } else {
        if (mode == 0 && type > 0) {
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        if (status == 0) {
            if (cm.haveItem(cube, cost)) {
                var text = "";
                text += "#L50024##b25% Total Damage#k#l\r\n";//td
                text += "#L50149##b50% Boss Damage#k#l\r\n";//boss
                text += "#L50224##b25% Drop Rate#k#l\r\n";//drop
                text += "#L50324##b25% Exp Rate#k#l\r\n";//exp
                text += "#L50449##b50% Meso Rate#k#l\r\n";//meso
                text += "#L50549##b50% Overpower#k#l\r\n";//op
                text += "#L50624##b25% Item Drop Power#k#l\r\n";//idp
                text += "#L50749##b50% IED#k#l\r\n";//ied
                text += "#L51024##b25% All Stats#k#l\r\n";//all stat
                text += "#L50904##b5% Damage Resist#k#l\r\n";//resist
                text += "#L51139##b100% Attack Power#k#l\r\n";//resist
                text += "#L51239##b100% Magic Power#k#l\r\n";//resist
                cm.sendSimple("Which #rBulk#k Potentail do you wish to auto stop on?\r\n\r\n" + text);
            } else {
                cm.sendOk("You currently do not have " + cost + "x #i" + cube + "# to single line cube your equips.");
            }
        } else if (status == 1) {
            if (cm.haveItem(cube, cost)) {
                pot = selection;
                selection = 0;
                equiplist = cm.getPlayer().getEquipItems();
                if (!equiplist.isEmpty()) {
                    var selStr = "";
                    for (var i = 0; i < equiplist.size(); i++) {
                        var curEquip = equiplist.get(i);
                        if (curEquip != null) {
                            selStr += "#L" + i + "##i" + curEquip.getItemId() + "# " + cm.getItemName(curEquip.getItemId()) + "#l\r\n\ ";
                        }
                    }
                    cm.sendSimple("Which equip would you like to Single Line Cube?\r\n\I only accept " + cost + "x #i" + cube + "#.\r\n\Rainbow Cubes contains ALL custom Potentials.\r\n\ " + selStr);
                } else {
                    cm.sendOk("You currently do not have any Equips to cube.");
                }
            } else {
                cm.sendOk("You currently do not have " + cost + "x #i" + cube + "# to single line cube your equips.");
            }

        } else if (status == 2) {
            if (equip == null) {
                equip = equiplist.get(selection);
            }
            cm.sendYesNoS("Are you sure you wish to apply #rAny and All#k #i" + cube + "#s to \r\n#i" + equip.getItemId() + "# " + cm.getItemName(equip.getItemId()) + "?", 16);
        } else if (status == 3) {
            if (equip != null) {
                var selStr = "";
                var total = 0;
                for (var i = 1; i < 6; i++) {
                    if (equip.getPotential(i) != 0) {
                        var old = equip.getPotential(i);
                        var used = cm.getPlayer().singleCubes(equip, cube, i, pot, 9999);
                        if (used > 0) {
                            cm.gainItem(cube, -(used));
                            if (equip.getPotential(i) != old) {
                                total += used;
                                selStr += "#fUI/UIWindow2.img/ToolTip/Equip/Star/Star2#   #e#rLine: " + i + " - " + cm.resolvePotentialID(equip, equip.getPotential(i)) + " (changed)#l\r\n";
                            } else {
                                selStr += "#fUI/UIWindow2.img/CTF/MinimapIcon/ItemRespawn#   #e#bLine: " + i + " - " + cm.resolvePotentialID(equip, equip.getPotential(i)) + " #l\r\n";
                            }
                        } else {
                            selStr += "#fUI/UIWindow2.img/CTF/MinimapIcon/ItemRespawn#   #e#bLine: " + i + " - " + cm.resolvePotentialID(equip, equip.getPotential(i)) + " #l\r\n";
                        }
                    }
                }
                cm.sendOk("#r#i" + cube + "# " + cm.getItemName(cube) + " (x" + total + ") was conumed.#k\r\n\r\n" + selStr + "");
            } else {
                cm.sendOk("invalid equip error pls report..");
            }
        } else if (status == 5) {

        }
    }
}


