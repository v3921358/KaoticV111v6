function enter(pi) {
    var eim = pi.getEventInstance();
    if (eim != null) {
        pi.getMap().setObjectFlag("portal_2", false);
        pi.warp(4504, 0);
    } else {
        pi.warp(4500, 0);
    }
}