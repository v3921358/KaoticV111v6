var status = -1;

function start() {
    if (cm.getMapId() == 802000820) {
		if (cm.getPlayer().getClient().getChannel() != 6) {
			cm.sendOk("This boss may only be attempted on channel 6.");
			            
			return;
		}
	var em = cm.getEventManager("Aufhaven");
	
	if (em == null) {
	    cm.sendOk("The event isn't started, please contact a GM.");
	                
	    return;
	}
	    	var prop = em.getProperty("state");
	if (prop == null || prop.equals("0")) {
	var squadAvailability = cm.getSquadAvailability("Aufheben");
	if (squadAvailability == -1) {
	    status = 0;
	    cm.sendYesNo("Are you interested in becoming the leader of the expedition Squad?");

	} else if (squadAvailability == 1) {
	    // -1 = Cancelled, 0 = not, 1 = true
	    var type = cm.isSquadLeader("Aufheben");
	    if (type == -1) {
		cm.sendOk("The squad has ended, please re-register.");
		            
	    } else if (type == 0) {
		var memberType = cm.isSquadMember("Aufheben");
		if (memberType == 2) {
		    cm.sendOk("You been banned from the squad.");
		                
		} else if (memberType == 1) {
		    status = 5;
		    cm.sendSimple("What do you want to do? \r\n#b#L0#Check out members#l \r\n#b#L1#Join the squad#l \r\n#b#L2#Withdraw from squad#l");
		} else if (memberType == -1) {
		    cm.sendOk("The squad has ended, please re-register.");
		                
		} else {
		    status = 5;
		    cm.sendSimple("What do you want to do? \r\n#b#L0#Check out members#l \r\n#b#L1#Join the squad#l \r\n#b#L2#Withdraw from squad#l");
		}
	    } else { // Is leader
		status = 10;
		cm.sendSimple("What do you want to do? \r\n#b#L0#Check out members#l \r\n#b#L1#Remove member#l \r\n#b#L2#Edit restricted list#l \r\n#r#L3#Enter map#l");
	    // TODO viewing!
	    }
	    } else {
			var eim = cm.getDisconnected("Aufhaven");
			if (eim == null) {
				var squd = cm.getSquad("Aufheben");
				if (squd != null) {
					cm.sendYesNo("The squad's battle against the boss has already begun.\r\n" + squd.getNextPlayer());
					status = 3;
				} else {
					cm.sendOk("The squad's battle against the boss has already begun.");
					cm.safeDispose();
				}
			} else {
				cm.sendYesNo("Ah, you have returned. Would you like to join your squad in the fight again?");
				status = 2;
			}
	    }
	} else {
			var eim = cm.getDisconnected("Aufhaven");
			if (eim == null) {
				var squd = cm.getSquad("Aufheben");
				if (squd != null) {
					cm.sendYesNo("The squad's battle against the boss has already begun.\r\n" + squd.getNextPlayer());
					status = 3;
				} else {
					cm.sendOk("The squad's battle against the boss has already begun.");
					cm.safeDispose();
				}
			} else {
				cm.sendYesNo("Ah, you have returned. Would you like to join your squad in the fight again?");
				status = 2;
			}
	}
    } else {
	status = 25;
	cm.sendNext("Do you want to get out now?");
    }
}

function action(mode, type, selection) {
    switch (status) {
	case 0:
	    if (mode == 1) {
			if (cm.registerSquad("Aufheben", 5, " has been named the Leader of the squad. If you would you like to join please register for the Expedition Squad within the time period.")) {
				cm.sendOk("You have been named the Leader of the Squad. For the next 5 minutes, you can add the members of the Expedition Squad.");
			} else {
				cm.sendOk("An error has occurred adding your squad.");
			}
	    }
	                
	    break;
	case 2:
		if (!cm.reAdd("Aufhaven", "Aufheben")) {
			cm.sendOk("Error... please try again.");
		}
		cm.safeDispose();
		break;
	case 3:
		if (mode == 1) {
			var squd = cm.getSquad("Aufheben");
			if (squd != null && !squd.getAllNextPlayer().contains(cm.getPlayer().getName())) {
				squd.setNextPlayer(cm.getPlayer().getName());
				cm.sendOk("You have reserved the spot.");
			}
		}
		            
		break;
	case 5:
	    if (selection == 0) {
		if (!cm.getSquadList("Aufheben", 0)) {
		    cm.sendOk("Due to an unknown error, the request for squad has been denied.");
		}
	    } else if (selection == 1) { // join
		var ba = cm.addMember("Aufheben", true);
		if (ba == 2) {
		    cm.sendOk("The squad is currently full, please try again later.");
		} else if (ba == 1) {
		    cm.sendOk("You have joined the squad successfully");
		} else {
		    cm.sendOk("You are already part of the squad.");
		}
	    } else {// withdraw
		var baa = cm.addMember("Aufheben", false);
		if (baa == 1) {
		    cm.sendOk("You have withdrawed from the squad successfully");
		} else {
		    cm.sendOk("You are not part of the squad.");
		}
	    }
	                
	    break;
	case 10:
	    if (mode == 1) {
		if (selection == 0) {
		    if (!cm.getSquadList("Aufheben", 0)) {
			cm.sendOk("Due to an unknown error, the request for squad has been denied.");
		    }
		                
		} else if (selection == 1) {
		    status = 11;
		    if (!cm.getSquadList("Aufheben", 1)) {
			cm.sendOk("Due to an unknown error, the request for squad has been denied.");
			            
		    }
		} else if (selection == 2) {
		    status = 12;
		    if (!cm.getSquadList("Aufheben", 2)) {
			cm.sendOk("Due to an unknown error, the request for squad has been denied.");
			            
		    }
		} else if (selection == 3) { // get insode
		    if (cm.getSquad("Aufheben") != null) {
			var dd = cm.getEventManager("Aufhaven");
			dd.startInstance(cm.getSquad("Aufheben"), cm.getMap());
		    } else {
			cm.sendOk("Due to an unknown error, the request for squad has been denied.");
		    }
		                
		}
	    } else {
		            
	    }
	    break;
	case 11:
	    cm.banMember("Aufheben", selection);
	                
	    break;
	case 12:
	    if (selection != -1) {
		cm.acceptMember("Aufheben", selection);
	    }
	                
	    break;
	case 25:
	    cm.warp(cm.getPlayer().getMapId() == 802000821 && cm.getPlayer().getMap().getAllMonstersThreadsafe().size() == 0 ? 802000823 : 802000820, 0);
	                
	    break;
    }
}