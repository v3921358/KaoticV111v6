/*  NPC : Samuel
	Pirate 4th job advancement
	Forest of the priest (240010501)
*/

var status = -1;

function action(mode, type, selection) {
    if (mode == 1) {
	status++;
    } else {
	status--;
    }

    if (status == 0) {
	if (!(cm.getJob() == 511 || cm.getJob() == 521 || cm.getJob() == 531)) {
	    cm.sendOk("Why do you want to see me? There is nothing you want to ask me.");
	    cm.safeDispose();
	    return;
	} else if (cm.getPlayerStat("LVL") < 120) {
	    cm.sendOk("You're still weak to go to pirate extreme road. If you get stronger, come back to me.");
	    cm.safeDispose();
	    return;
	} else {
	    if (cm.getQuestStatus(6944) == 2 || cm.getJob() == 531) {
		if (cm.getJob() == 511)
		    cm.sendSimple("You're qualified to be a true pirate. \r\nDo you want job advancement?\r\n#b#L0# I want to advance to Viper.#l\r\n#b#L1#  Let me think for a while.#l");
		else if (cm.getJob() == 531) {
		    if (cm.haveItem(4031348)) {
		        cm.sendSimple("You're qualified to be a true pirate. \r\nDo you want job advancement?\r\n#b#L0# I want to advance to Cannon Master.#l\r\n#b#L1#  Let me think for a while.#l");
		    } else {
			cm.sendNext("You need the Secret Scroll for 10 million meso.");
			            
			return;
		    }
		    
		} else
		    cm.sendSimple("You're qualified to be a true pirate. \r\nDo you want job advancement?\r\n#b#L0# I want to advance to Captain.#l\r\n#b#L1#  Let me think for a while.#l");
	    } else {
		cm.sendOk("You're not ready to make 4th job advancement. When you're ready, talk to me.");
		cm.safeDispose();
		return;
	    }
	}
    } else if (status == 1) {
	if (selection == 1) {
	    cm.sendOk("You don't have to hesitate.... Whenever you decide, talk to me. If you're ready, I'll let you make the 4th job advancement.");
	    cm.safeDispose();
	    return;
	}
	if (cm.getPlayerStat("RSP") > (cm.getPlayerStat("LVL") - 120) * 3) { //player have too much SP means they havent assigned to their skills
	    if (cm.getPlayer().getAllSkillLevels() > cm.getPlayerStat("LVL") * 3) { //player used too much SP means they have assigned to their skills.. conflict
		cm.sendOk("It appears that you have a great number of SP yet you have used enough SP on your skills already. Your SP has been reset. #ePlease talk to me again to make the job advancement.#n");
		cm.getPlayer().resetSP((cm.getPlayerStat("LVL") - 120) * 3);
	    } else {
	    	cm.sendOk("Hmm...You have too many #bSP#k. You can't make the job advancement with too many SP left.");
	    }
	    cm.safeDispose();
	    return;
	} else {
		if (cm.getJob() == 511) {
		    cm.changeJob(512);
		    cm.sendNext("You became the best pirate #bViper#k. ");
		} else if (cm.getJob() == 521) {
		    cm.changeJob(522);
		    cm.sendNext("You became the best pirate #bCaptain#k.  ");
		} else if (cm.getJob() == 531) {
		    cm.gainItem(4031348, -1);
		    cm.changeJob(532);
		    cm.sendNext("You became the best pirate #bCannon Master#k.  ");
		}
	}
    } else if (status == 2) {
	if (cm.getJob() == 512) {
	    cm.sendNext("This is not all about Viper. ");
	} else if (cm.getJob() == 532) {
	    cm.sendNext("This is not all about Cannon Master. ");
	} else {
	    cm.sendNext("This is not all about Captain. ");
	}
    } else if (status == 3) {
	cm.sendNextPrev("Don't forget that it all depends on how much you train.");
    } else if (status == 4) {
	            
    }
}