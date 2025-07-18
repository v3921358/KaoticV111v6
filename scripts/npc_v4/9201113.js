var status = -1;

function start() {
	cm.removeAll(4001256);
	cm.removeAll(4001257);
	cm.removeAll(4001258);
	cm.removeAll(4001259);
	cm.removeAll(4001260);
		if (cm.getPlayer().getLevel() < 90) {
			cm.sendOk("There is a level requirement of 90 to attempt Crimsonwood Keep.");
			            
			return;
		}
		if (cm.getPlayer().getClient().getChannel() != 9 && cm.getPlayer().getClient().getChannel() != 10 && cm.getPlayer().getClient().getChannel() != 11 && cm.getPlayer().getClient().getChannel() != 8) {
			cm.sendOk("Crimsonwood Keep may only be attempted on channel 8,9,10,11.");
			            
			return;
		}
    var em = cm.getEventManager("CWKPQ");

    if (em == null) {
	cm.sendOk("The event isn't started, please contact a GM.");
	            
	return;
    }
    var prop = em.getProperty("state");

    if (prop == null || prop.equals("0")) {
	var squadAvailability = cm.getSquadAvailability("CWKPQ");
	if (squadAvailability == -1) {
	    status = 0;
	    cm.sendYesNo("Are you interested in becoming the leader of the expedition Squad?");

	} else if (squadAvailability == 1) {
	    // -1 = Cancelled, 0 = not, 1 = true
	    var type = cm.isSquadLeader("CWKPQ");
	    if (type == -1) {
		cm.sendOk("The squad has ended, please re-register.");
		            
	    } else if (type == 0) {
		var memberType = cm.isSquadMember("CWKPQ");
		if (memberType == 2) {
		    cm.sendOk("You been banned from the squad.");
		                
		} else if (memberType == 1) {
		    status = 5;
		    cm.sendSimple("What do you want to do? \r\n#b#L0#Check out members#l \r\n#b#L1#Join the squad#l \r\n#b#L2#Withdraw from squad#l \r\n#b#L3#Check out jobs#l");
		} else if (memberType == -1) {
		    cm.sendOk("The squad has ended, please re-register.");
		                
		} else {
		    status = 5;
		    cm.sendSimple("What do you want to do? \r\n#b#L0#Check out members#l \r\n#b#L1#Join the squad#l \r\n#b#L2#Withdraw from squad#l \r\n#b#L3#Check out jobs#l");
		}
	    } else { // Is leader
		status = 10;
		cm.sendSimple("What do you want to do? \r\n#b#L0#Check out members#l \r\n#b#L1#Remove member#l \r\n#b#L2#Edit restricted list#l \r\n#b#L3#Check out jobs#l \r\n#r#L4#Enter map#l");
	    // TODO viewing!
	    }
	} else {
			var eim = cm.getDisconnected("CWKPQ");
			if (eim == null) {
				var squd = cm.getSquad("CWKPQ");
				if (squd != null) {
					if (squd.getNextPlayer() != null) {
						cm.sendOk("The squad's battle against the boss has already begun. The player to reserve the next spot is " + squd.getNextPlayer());
						cm.safeDispose();
					} else {
						cm.sendYesNo("The squad's battle against the boss has already begun. Would you like to queue the next spot?");
						status = 3;
					}
				} else {
					cm.sendOk("The squad's battle against the boss has already begun.");
					cm.safeDispose();
				}
			} else {
				cm.sendYesNo("Ah, you have returned. Would you like to join your squad in the fight again?");
				status = 1;
			}
	}
    } else {
			var eim = cm.getDisconnected("CWKPQ");
			if (eim == null) {
				var squd = cm.getSquad("CWKPQ");
				if (squd != null) {
					if (squd.getNextPlayer() != null) {
						cm.sendOk("The squad's battle against the boss has already begun. The player to reserve the next spot is " + squd.getNextPlayer());
						cm.safeDispose();
					} else {
						cm.sendYesNo("The squad's battle against the boss has already begun. Would you like to queue the next spot?");
						status = 3;
					}
				} else {
					cm.sendOk("The squad's battle against the boss has already begun.");
					cm.safeDispose();
				}
			} else {
				cm.sendYesNo("Ah, you have returned. Would you like to join your squad in the fight again?");
				status = 1;
			}
    }
}

function action(mode, type, selection) {
    switch (status) {
	case 0:
	    	if (mode == 1) {
			if (!cm.haveItem(4032012, 1)) {
				cm.sendOk("You need 1 Crimson Heart to apply.");
			} else if (cm.registerSquad("CWKPQ", 5, " has been named the Leader of the squad. If you would you like to join please register for the Expedition Squad within the time period.")) {
				cm.sendOk("You have been named the Leader of the Squad. For the next 5 minutes, you can add the members of the Expedition Squad.");
			} else {
				cm.sendOk("An error has occurred adding your squad.");
			}
	    	}
	                
	    break;
	case 1:
		if (!cm.reAdd("CWKPQ", "CWKPQ")) {
			cm.sendOk("Error... please try again.");
		}
		cm.safeDispose();
		break;
	case 3:
		if (mode == 1) {
			var squd = cm.getSquad("CWKPQ");
			if (squd != null && squd.getNextPlayer() == null) {
				squd.setNextPlayer(cm.getPlayer().getName());
				cm.sendOk("You have reserved the spot.");
			}
		}
		            
		break;
	case 5:
	    if (selection == 0 || selection == 3) {
		if (!cm.getSquadList("CWKPQ", selection)) {
		    cm.sendOk("Due to an unknown error, the request for squad has been denied.");
		}
	    } else if (selection == 1) { // join
		var ba = cm.addMember("CWKPQ", true);
		if (ba == 2) {
		    cm.sendOk("The squad is currently full, please try again later.");
		} else if (ba == 1) {
		    cm.sendOk("You have joined the squad successfully");
		} else {
		    cm.sendOk("You are already part of the squad.");
		}
	    } else {// withdraw
		var baa = cm.addMember("CWKPQ", false);
		if (baa == 1) {
		    cm.sendOk("You have withdrawed from the squad successfully");
		} else {
		    cm.sendOk("You are not part of the squad.");
		}
	    }
	                
	    break;
	case 10:
	    if (mode == 1) {
		if (selection == 0 || selection == 3) {
		    if (!cm.getSquadList("CWKPQ", selection)) {
			cm.sendOk("Due to an unknown error, the request for squad has been denied.");
		    }
		                
		} else if (selection == 1) {
		    status = 11;
		    if (!cm.getSquadList("CWKPQ", 1)) {
			cm.sendOk("Due to an unknown error, the request for squad has been denied.");
			            
		    }
		} else if (selection == 2) {
		    status = 12;
		    if (!cm.getSquadList("CWKPQ", 2)) {
			cm.sendOk("Due to an unknown error, the request for squad has been denied.");
			            
		    }
		} else if (selection == 4) { // get insode
		    if (cm.getSquad("CWKPQ") != null) {
			if (cm.haveItem(4032012, 1)) {
			    cm.gainItem(4032012, -1);
			    var dd = cm.getEventManager("CWKPQ");
			    dd.startInstance(cm.getSquad("CWKPQ"), cm.getMap());
			} else {
		 	    cm.sendOk("Where is my Crimson Heart?");
			}
		    } else {
			cm.sendOk("Due to an unknown error, the request for squad has been denied.");
		    }
		                
		}
	    } else {
		            
	    }
	    break;
	case 11:
	    cm.banMember("CWKPQ", selection);
	                
	    break;
	case 12:
	    if (selection != -1) {
		cm.acceptMember("CWKPQ", selection);
	    }
	                
	    break;
	default:
	                
	    break;
    }
}