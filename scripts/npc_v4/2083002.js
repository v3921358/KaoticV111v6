/*
	Crystal of Roots - Leafre Cave of life
 */

var status = -1;

function action(mode, type, selection) {
    if (mode == 1) {
	status++;
    } else {
	status--;
    }
    if (status == 0) {
	cm.sendYesNo("Do you want to go back to #m240050000#?");
    } else if (status == 1) {
	cm.warp(240050000, 0);
	            
    }
}