/*
 Fairy Tale Fairy Crackers - Every Town()
 */

var fromWitch = false;

function start() {
    if (cm.getMapId() == 980040000) {
        fromWitch = true;
        cm.sendSimple("#b(Hmmm...so if you touch the moving the rising chocolate, then you'll bounce out..) #kEh? Who are you? Which of those cats told you that you can find treasures here? Hmmm, well okay. Since you made it this far, might as well try it. Which of these difficulty levels do you want to take on?....\r\n\r\n#b#L0# #v03994115##l #L1# #v03994116##l #L2# #v03994117##l");
    } else {
        cm.sendSimple("Hey who are you? Are you...one of those Ninjas looking to steal some treasures from here? \r\n #L0##bTreasures?#l \r\n #L1##b(Secretly) Head over to Witch Tower#k#l");
    }
}

function action(mode, type, selection) {
    if (!fromWitch) {
        switch (selection) {
            case 0:
                cm.sendOk("T...treasures? Who...who said that? Do you think I'd tell you that the Pink Bean Hat made by the witch with Pink Bean that looks like this #v01002971:# can be obtained after clearing normal or hard mode 5 times, and Pink Bean Suit looks like this #v01052202:# can be obtained after getting Pink Bean Hat and go to grave yard through portal in the top right of Witch Tower Entrance? As if!..");
                break;
            case 1:
                cm.warp(980040000, 0);
                break;
        }
    } else {
        switch (selection) {
            case 0:
            {
                cm.warp(980041000, 0);
                //cm.getEventManager("WitchTower_Easy").startPlayerInstance(cm.getPlayer());
                break;
            }
            case 1:
            {
                cm.warp(980042000, 0);
                //cm.getEventManager("WitchTower_Med").startPlayerInstance(cm.getPlayer());
                break;
            }
            case 2:
            {
                cm.warp(980043000, 0);
                //cm.getEventManager("WitchTower_Hard").startPlayerInstance(cm.getPlayer());
                break;
            }
            case 2:
            {
                cm.warp(980044000, 0);
                //cm.getEventManager("WitchTower_Hell").startPlayerInstance(cm.getPlayer());
                break;
            }
        }
    }

}