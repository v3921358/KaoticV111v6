var quantities = Array(10, 8, 6, 5, 4, 3, 2, 1, 1, 1);
var prize1 = Array(1442047, 2000000, 2000001, 2000002, 2000003, 2000004, 2000005, 2430036, 2430037, 2430038, 2430039, 2430040); //1 day
var prize2 = Array(1442047, 4080100, 4080001, 4080002, 4080003, 4080004, 4080005, 4080006, 4080007, 4080008, 4080009, 4080010, 4080011);
var prize3 = Array(1442047, 1442048, 2022070);
var prize4 = Array(1442048, 2430082, 2430072); //7 day
var prize5 = Array(1442048, 2430091, 2430092, 2430093, 2430101, 2430102); //10 day
var prize6 = Array(1442048, 1442050, 2430073, 2430074, 2430075, 2430076, 2430077); //15 day
var prize7 = Array(1442050, 3010183, 3010182, 3010053, 2430080); //20 day
var prize8 = Array(1442050, 3010178, 3010177, 3010075, 1442049, 2430053, 2430054, 2430055, 2430056, 2430103, 2430136); //30 day
var prize9 = Array(1442049, 3010123, 3010175, 3010170, 3010172, 3010173, 2430201, 2430228, 2430229); //60 day
var prize10 = Array(1442049, 3010172, 3010171, 3010169, 3010168, 3010161, 2430117, 2430118, 2430119, 2430120, 2430137); //1 year
var status = 0;

function start() {
	status = -1;
	action(1, 0, 0);
}

function action(mode, type, selection) {
	if (mode == -1) {
		            
	} else {
		if (status >= 0 && mode == 0) {
			            
			return;
		}	
		if (mode == 1)
			status++;
		else
			status--;
		if (status == 0) {	
			cm.sendNext("Hey, I'm #p" + cm.getNpc() + "#k, if you're not busy and all ... then can I hang out with you? I heard there are people gathering up around here for an #revent#k but I don't want to go there by myself ... Well, do you want to go check it out with me?");
		} else if (status == 1) {	
			cm.sendSimple("Huh? What kind of an event? Well, that's...\r\n#L0##e1.#n#b What kind of an event is it?#k#l\r\n#L1##e2.#n#b Explain the event game to me.#k#l\r\n#L2##e3.#n#b Alright, let's go!#k#l\r\n#L3##e4.#n#bPlease exchance Certificate of straight Win to reward item.#k#l");
		} else if (status == 2) {
			if (selection == 0) {
				cm.sendNext("All this month, MapleStory Global is celebrating its 3rd anniversary! The GM's will be holding surprise GM Events throughout the event, so stay on your toes and make sure to participate in at least one of the events for great prizes!");
				            
			} else if (selection == 1) {
				cm.sendSimple("There are many games for this event. It will help you a lot to know how to play the game before you play it. Choose the one you want to know more of! #b\r\n#L0# Ola Ola#l\r\n#L1# MapleStory Maple Physical Fitness Test#l\r\n#L2# Snow Ball#l\r\n#L3# Coconut Harvest#l\r\n#L4# OX Quiz#l\r\n#L5# Treasure Hunt#l#k");
			} else if (selection == 2) {
				var marr = cm.getQuestRecord(160200);
				if (marr.getCustomData() == null) {
					marr.setCustomData("0");
				}
				var dat = parseInt(marr.getCustomData());
				if (dat + 3600000 >= cm.getCurrentTime()) {
					cm.sendNext("You've entered the event already in the past hour.");
				} else if (!cm.canHold()) {
					cm.sendNext("Save up some space in your inventory.");
				} else if (cm.getChannelServer().getEvent() > -1 && !cm.haveItem(4031019)) {
					cm.saveReturnLocation("EVENT");
					cm.getPlayer().setChalkboard(null);
					marr.setCustomData("" + cm.getCurrentTime());
					cm.warp(cm.getChannelServer().getEvent(), cm.getChannelServer().getEvent() == 109080000 || cm.getChannelServer().getEvent() == 109080010 ? 0 : "join00");
				} else {
					cm.sendNext("Either the event has not been started, you already have the #bScroll of Secrets#k, or you have already participated in this event within the last 24 hours. Please try again later!");
				}
				            
			} else if (selection == 3) {
				var selStr = "Which Certificate of straight Win do you wish to exchange?";
				for (var i = 0; i < quantities.length; i++) {
					selStr += "\r\n#b#L" + i + "##t" + (4031332 + i) + "# Exchange(" + quantities[i] + ")#l";
				}
				cm.sendSimple(selStr);
				status = 9;
			}
		} else if (status == 3) {
			if (selection == 0) {
				cm.sendNext("#b[Ola Ola]#k is a game where participants climb ladders to reach the top. Climb your way up and move to the next level by choosing the correct portal out of the numerous portals available. \r\n\r\nThe game consists of three levels, and the time limit is #b6 MINUTES#k. During [Ola Ola], you #bwon't be able to jump, teleport, haste, or boost your speed using potions or items#k. There are also trick portals that'll lead you to a strange place, so please be aware of those.");
				            
			} else if (selection == 1) {
				cm.sendNext("#b[MapleStory Physical Fitness Test] is a race through an obstacle course#k much like the Forest of Patience. You can win it by overcoming various obstacles and reach the final destination within the time limit. \r\n\r\nThe game consists of four levels, and the time limit is #b15 MINUTES#k. During [MapleStory Physical Fitness Test], you won't be able to use teleport or haste.");
				            
			} else if (selection == 2) {
				cm.sendNext("#b[Snowball]#k consists of two teams, Maple Team and Story Team, and the two teams duke it out to see #bwhich team rolled the snowball farther and bigger in a limited time#k. If the game cannot be decided within the time period, then the team that rolled the snowball farther wins. \r\n\r\nTo roll up the snow, attack it by pressing #bCtrl#k. All long-ranged attacks and skill-based attacks will not work here, #bonly the close-range attacks will work#k. \r\n\r\nIf a character touches the snowball, he/she'll be sent back to the starting point. Attack the snowman in front of the starting point to prevent the opposing team from rolling the snow forward. This is where a well-planned strategy works, as the team will decide whether to attack the snowball or the snowman.");
				            
			} else if (selection == 3) {
				cm.sendNext("#b[Coconut Harvest]#k consists of two teams, Maple Team and Story Team, and the two teams duke it out to see #bwhich team gathers up the most coconuts#k. The time limit is #b5 MINUTES#k. If the game ends in a tie, an additional 2 minutes will be awarded to determine the winner. If, for some reason, the score stays tied, then the game will end in a draw. \r\n\r\nAll long-range attacks and skill-based attacks will not work here, #bonly the close-range attacks will work#k. If you don't have a weapon for the close-range attacks, you can purchase them through an NPC within the event map. No matter the level of character, the weapon, or skills, all damages applied will be the same.\r\n\r\nBeware of the obstacles and traps within the map. If the character dies during the game, the character will be eliminated from the game. The player who strikes last before the coconut drops wins. Only the coconuts that hit the ground counts, which means the ones that do not fall off the tree, or the occasional explosion of the coconuts WILL NOT COUNT. There's also a hidden portal at one of the shells at the bottom of the map, so use that wisely!");
				            
			} else if (selection == 4) {
				cm.sendNext("#b[OX Quiz]#k is a game of MapleStory smarts through X's and O's. Once you join the game, turn on the minimap by pressing #bM#k to see where the X and O are. A total of #r10 questions#k will be given, and the character that answers them all correctly wins the game. \r\n\r\nOnce the question is given, use the ladder to enter the area where the correct answer may be, be it X or O. If the character does not choose an answer or is hanging on the ladder past the time limit, the character will be eliminated. Please hold your position until [CORRECT] is off the screen before moving on. To prevent cheating of any kind, all types of chatting will be turned off during the OX Quiz.");
				            
			} else if (selection == 5) {
				cm.sendNext("#b[Treasure Hunt]#k is a game in which your goal is to find the #btreasure scrolls#k that are hidden all over the map #rin 10 minutes#k. There will be a number of mysterious treasure chests hidden away, and once you break them apart, many items will surface from the chest. Your job is to pick out the treasure scroll from those items. \r\nTreasure chests can be destroyed using #bregular attacks#k, and once you have the treasure scroll in possession, you can trade it for the Scroll of Secrets through an NPC that's in charge of trading items. The trading NPC can be found on the Treasure Hunt map, but you can also trade your scroll through #bVikin#k of Lith Harbor.\r\n\r\nThis game has its share of hidden portals and hidden teleporting spots. To use them, press the #bup arrow#k at a certain spot, and you'll be teleported to a different place. Try jumping around, for you may also run into hidden stairs or ropes. There will also be a treasure chest that'll take you to a hidden spot, and a hidden chest that can only be found through the hidden portal, so try looking around.\r\n\r\nDuring the game of Treasure Hunt, all attack skills will be #rdisabled#k, so please break the treasure chest with the regular attack.");
				            
			}
		} else if (status == 10) {
			if (selection < 0 || selection > quantities.length) {
				return;
			}
			var ite = 4031332 + selection;
			var quan = quantities[selection];
			var pri;
			switch(selection) {
				case 0:
					pri = prize1;
					break;
				case 1:
					pri = prize2;
					break;
				case 2:
					pri = prize3;
					break;
				case 3:
					pri = prize4;
					break;
				case 4:
					pri = prize5;
					break;
				case 5:
					pri = prize6;
					break;
				case 6:
					pri = prize7;
					break;
				case 7:
					pri = prize8;
					break;
				case 8:
					pri = prize9;
					break;
				case 9:
					pri = prize10;
					break;
				default:
					            
					return;
			}
			var rand = java.lang.Math.floor(java.lang.Math.random() * pri.length);
			if (!cm.haveItem(ite, quan)) {
				cm.sendOk("You need #b" + quan + " #t" + ite + "##k to exchange it with item.");
			} else if (cm.getInventory(1).getNextFreeSlot() <= -1 || cm.getInventory(2).getNextFreeSlot() <= -1 || cm.getInventory(3).getNextFreeSlot() <= -1 || cm.getInventory(4).getNextFreeSlot() <= -1) {
				cm.sendOk("You need space for this item.");
			} else {
				cm.gainItem(pri[rand], 1);
				cm.gainItem(ite, -quan);
				cm.gainMeso(100000 * selection); //temporary prize lolol
			}
			            
		}
	}
}