/*
	Robert Holly - Ludibrium: Ludibrium (220000000)
*/

var status = 0;
	
function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (status == 0 && mode == 0) {
	cm.sendNext("I see... you don't have as many friends as I thought you would. Hahaha, just kidding! Anyway if you feel like changing your mind, please feel free to come back and we'll talk business. If you make a lot of friends, then you know ... hehe ...");
	            
	return;
    } else if (status >= 1 && mode == 0) {
	cm.sendNext("I see... I don't think you don't have as many friends as I thought you would. If not, you just don't have 240,000 mesos with you right this minute? Anyway, if you ever change your mind, come back and we'll talk business. That is, of course, once you have get some financial relief. .. hehe ...");
	            
	return;
    }
    if (mode == 1)
	status++;
    else
	status--;
    if (status == 0) {
	cm.sendYesNo("I hope I can make as much as yesterday... well, hello! Don't you want to extend your buddy list? You look like someone who'd have a whole lot of friends... well, what do you think? With some money I can make it happen for you. Remember, though, it only applies to one character at a time, so it won't affect any of your other characters on your account. Do you want to extend your buddy list?");
    } else if (status == 1) {
	cm.sendYesNo("Alright, good call! It's not that expensive actually. #b240,000 mesos and I'll add 5 more slots to your buddy list#k. And no, I won't be selling them individually. Once you buy it, it's going to be permanently on your buddy list. So if you're one of those that needs more space there, then you might as well do it. What do you think? Will you spend 240,000 mesos for it?");
    } else if (status == 2) {
	var capacity = cm.getBuddyCapacity();
	if (capacity >= 50 || cm.getMeso() < 240000){
	    cm.sendNext("Hey... are you sure you have #b240,000 mesos#k? If so, then check and see if you have extended your buddy list to the max. Even if you pay up, the most you can have on your buddy list is #b50#k.");
	                
	} else {
	    var newcapacity = capacity + 5;
	    cm.gainMeso(-240000);
	    cm.updateBuddyCapacity(newcapacity);
	    cm.sendOk("Alright! Your buddy list will have 5 extra slots by now. Check and see for it yourself. And if you still need more room on your buddy list, you know who to find. Of course, it isn't going to be for free ... well, so long ...");
	                
	}
    }
}