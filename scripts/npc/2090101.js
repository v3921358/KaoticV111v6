/* Lilishu
	Mu Lung Random Hair/Hair Color Change.
*/
var status = 0;
var beauty = 0;
var mhair = Array(30250, 30350, 30270, 30150, 30300, 30600, 30160, 30700, 30720, 30420);
var fhair = Array(31040, 31250, 31310, 31220, 31300, 31680, 31160, 31030, 31230, 31690, 31210, 31170, 31450);
var hairnew = Array();

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 0 && status == 0) {
	            
	return;
    }
    if (mode == 1)
	status++;
    else
	status--;
    if (status == 0) {
	cm.sendSimple("I'm a hair assistant in this shop. If you have #b#t5150024##k or #b#t5151019##k by any chance, then how about letting me change your hairdo? \r\n#L0#Haircut: #i5150024##t5150024##l\r\n#L1#Dye your hair: #i5151019##t5151019##l");
    } else if (status == 1) {
	if (selection == 0) {
	    var hair = cm.getPlayerStat("HAIR");
	    hair_Colo_new = [];
	    beauty = 1;

	    if (cm.getPlayerStat("GENDER") == 0) {
		hair_Colo_new = [30250, 30110, 30230, 30050, 30280, 30410, 30730, 30160, 30200];
	    } else {
		hair_Colo_new = [31150, 31310, 31220, 31300, 31260, 31160, 31730, 31410, 31410];
	    }
	    for (var i = 0; i < hair_Colo_new.length; i++) {
		hair_Colo_new[i] = hair_Colo_new[i] + (hair % 10);
	    }
	    cm.sendYesNo("If you use the EXP coupon your hair will change RANDOMLY with a chance to obtain a new experimental style that I came up with. Are you going to use #b#t5150024##k and really change your hairstyle?");
	} else if (selection == 1) {
	    var currenthaircolo = Math.floor((cm.getPlayerStat("HAIR") / 10)) * 10;
	    hair_Colo_new = [];
	    beauty = 2;

	    for (var i = 0; i < 8; i++) {
		hair_Colo_new[i] = currenthaircolo + i;
	    }
	    cm.sendYesNo("If you use a regular coupon your hair will change RANDOMLY. Do you still want to use #b#t5151019##k and change it up?");
	}
    } else if (status == 2){
	if (beauty == 1) {
	    if (cm.setRandomAvatar(5150024, hair_Colo_new) == 1) {
		cm.sendOk("Enjoy your new and improved hairstyle!");
	    } else {
		cm.sendOk("Hmmm...it looks like you don't have our designated coupon...I'm afraid I can't give you a haircut without it. I'm sorry...");
	    }
	} else {
	    if (cm.setRandomAvatar(5151019, hair_Colo_new) == 1) {
		cm.sendOk("Enjoy your new and improved hair colour!");
	    } else {
		cm.sendOk("Hmmm...it looks like you don't have our designated coupon...I'm afraid I can't dyle your hair without it. I'm sorry...");
	    }
	}
	            
    }
}