/*
	NPC Name: 		Rini
	Map(s): 		Orbis: Station<To Ellinia> (200000111)
	Description: 		Orbis Ticketing Usher
*/
var status = 0;

function start() {
    status = -1;
    boat = cm.getEventManager("Boats");
    action(1, 0, 0);
}

function action(mode, type, selection) {
    status++;
    if(mode == 0) {
	cm.sendNext("You must have some business to take care of here, right?");
	            
	return;
    }
    if (status == 0) {
	if(boat == null) {
	    cm.sendNext("The boats are currently down.");
	                
	} else if(boat.getProperty("entry").equals("true")) {
	    cm.sendYesNo("It looks like there's plenty of room for this ride. Please have your ticket ready so I can let you in, The ride will be long, but you'll get to your destination just fine. What do you think? Do you want to get on this ride?");
	} else if(boat.getProperty("entry").equals("false") && boat.getProperty("docked").equals("true")) {
	    cm.sendNext("The boat is getting ready for takeoff. I'm sorry, but you'll have to get on the next ride. The ride schedule is available through the usher at the ticketing booth.");
	                
	} else {
	    cm.sendNext("We will begin boarding 1 minutes before the takeoff. Please be patient and wait for a few minutes. Be aware that the subway will take off on time, and we stop receiving tickets 1 minute before that, so please make sure to be here on time.");
	                
	}
    } else if(status == 1) {
	cm.warp(200000112, 0);
	            
    }
}