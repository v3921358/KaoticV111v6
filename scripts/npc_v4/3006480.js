var status = 0;
var groupsize = 0;
var item = 4031312;
var itemName = "#i4031312#";
var ach = 441;
var cost = 0;
var multi = 1;
var password = 0;

function start() {
    var number1 = cm.random(1, 9);
    var number2 = cm.random(1, 9);
    var number3 = cm.random(1, 9);
    var number4 = cm.random(1, 9);
    password = cm.getCode(number1, number2, number3, number4);
    cm.sendGetText("#rWhen you see a Gacha Code like this, it means botting inside these instances or event is not allowed.#k\r\nFailing the code does not cause any harm but to your ego.\r\n\Please enter the 4 digit #rAnti-Bot#k Code seen below:\r\n\    " + cm.getDamageSkinNumber(number1, number2, number3, number4) + "");
}

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
        if (status == 0) {
            return;
        }
        status--;
    }
    if (status == 1) {
        var amount = cm.getNumber();
        if (amount == password) {
            if (cm.getPlayer().isGroup()) {
                if (cm.getPlayer().isLeader()) {
                    var text = "You better have brought my #b" + itemName + " " + cm.getItemName(item) + "s#k\r\nCurrent Amount: (#b" + cm.convertNumber(cm.getPlayer().countAllItem(item)) + "#k)\r\n";
                    //text += "#L1# #rCash in #i" + orb + "#" + cm.getItemName(orb) + " for Fel Power!#k#l\r\n\r\n";
                    text += "#L1# #rReborns: 25 Tier: 250#k - Price: #b" + (10) + " " + itemName + "#k#l\r\n";
                    text += "#L2# #rReborns: 50 Tier: 300#k - Price: #b" + (25) + " " + itemName + "#k#l\r\n";
                    text += "#L3# #rReborns: 75 Tier: 400#k - Price: #b" + (50) + " " + itemName + "#k#l\r\n";
                    text += "#L4# #rReborns: 100 Tier: 500#k - Price: #b" + (100) + " " + itemName + "#k#l\r\n";
                    text += "#L5# #rReborns: 150 Tier: 600#k - Price: #b" + (150) + " " + itemName + "#k#l\r\n";
                    text += "#L6# #rReborns: 200 Tier: 800#k - Price: #b" + (200) + " " + itemName + "#k#l\r\n";
                    text += "#L7# #rReborns: 250 Tier: 999#k - Price: #b" + (250) + " " + itemName + "#k#l\r\n";
                    //text += "#L6# #rLevel: 9999 Tier: 250#k - Price: #b" + (1000 * multi) + " " + itemName + "#k#l\r\n";
                    cm.sendSimple(text);
                } else {
                    cm.sendOkS("Have the party leader talk to me.", 2);
                }
            } else {
                cm.sendOk("Event is Party mode Only!?.");
            }
        } else {
            cm.sendOk("Wrong password.");
        }
    }
    if (status == 2) {
        var em = cm.getEventManager("LMPQ_Solo_Hard");
        if (em != null) {
            var level = 9999;
            var tier = 250;
            var cookies = 10, reborns = 25;
            if (selection == 2) {
                tier = 300;
                cookies = 25;
                reborns = 50;
            }
            if (selection == 3) {
                tier = 400;
                cookies = 50;
                reborns = 75;
            }
            if (selection == 4) {
                tier = 500;
                cookies = 100;
                reborns = 100;
            }
            if (selection == 5) {
                tier = 600;
                cookies = 150;
                reborns = 150;
            }
            if (selection == 6) {
                tier = 800;
                cookies = 200;
                reborns = 200;
            }
            if (selection == 7) {
                tier = 999;
                cookies = 250;
                reborns = 250;
            }
            if (cm.haveItem(item, cookies)) {
                if (em.getEligiblePartyAchReborn(cm.getPlayer(), 9000, ach, 1, 1, reborns)) {
                    if (!em.startPlayerInstance(cm.getPlayer(), level, tier)) {
                        cm.sendOk("Someone is already attempting the PQ or your instance is currently being reseted. Try again in few seconds.");
                    } else {
                        cm.gainItem(item, -cookies);
                    }
                } else {
                    cm.sendOk("You cannot start this party quest yet, because either your party is not in the range size, some of your party members are not eligible to attempt it or they are not in this map. Minimum requirements are: Level " + level + ", 1+ Raid members.");
                }
            } else {
                cm.sendOk("Where is my #r" + cookies + "#k #b" + itemName + " " + cm.getItemName(item) + "s#k????");
            }
        } else {
            cm.sendOk("Event has already started, Please wait.");
        }

    }
}