/* Dr. Rhomes
	Orbis Random/VIP Eye Color Change.
*/
var status = -1;
var beauty = 0;
var hair_Colo_new;

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 0) {
	            
	return;
    } else {
	status++;
    }

    if (status == 0) {
	cm.sendSimple("Hello, I'm Dr. Rhomes, head of the cosmetic lens department here at the Orbis Plastic Surgery Shop.\r\nMy goal here is to add personality to everyone's eyes through the wonders of cosmetic lenses, and with #b#t5152011##k or #b#t5152014##k, I can do the same for you, too! Now, what would you like to use?\r\n#L0#Cosmetic Lenses: #i5152011##t5152011##l\r\n#L1#Cosmetic Lenses: #i5152014##t5152014##l");
    } else if (status == 1) {
	hair_Colo_new = [];

	var teye = cm.getPlayerStat("FACE") % 100;

	if (cm.getPlayerStat("GENDER") == 0) {
	    teye += 20000;
	} else {
	    teye += 21000;
	}
	hair_Colo_new[0] = teye + 100;
	hair_Colo_new[1] = teye + 200;
	hair_Colo_new[2] = teye + 300;
	hair_Colo_new[3] = teye + 400;
	hair_Colo_new[4] = teye + 500;
	hair_Colo_new[5] = teye + 600;
	hair_Colo_new[6] = teye + 700;

	if (selection == 0) {
	    beauty = 1;
	    cm.sendYesNo("If you use the regular coupon, you'll be awarded a random pair of cosmetic lenses. Are you going to use a #b#t5152011##k and really make the change to your eyes?");
	} else if (selection == 1) {
	    beauty = 2;
	    
	    cm.askAvatar("With our new computer program, you can see yourself after the treatment in advance. What kind of lens would you like to wear? Please choose the style of your liking.", hair_Colo_new);
	}
    } else if (status == 2){
	if (beauty == 1){
	    if (cm.setRandomAvatar(5152011, hair_Colo_new) == 1) {
		cm.sendOk("Enjoy your new and improved cosmetic lenses!");
	    } else {
		cm.sendOk("I'm sorry, but I don't think you have our cosmetic lens coupon with you right now. Without the coupon, I'm afraid I can't do it for you..");
	    }
	} else {
	    if (cm.setAvatar(5152014, hair_Colo_new[selection]) == 1) {
		cm.sendOk("Enjoy your new and improved cosmetic lenses!");
	    } else {
		cm.sendOk("I'm sorry, but I don't think you have our cosmetic lens coupon with you right now. Without the coupon, I'm afraid I can't do it for you..");
	    }
	}
	            
    }
}