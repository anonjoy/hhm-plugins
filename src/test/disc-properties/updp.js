
var room = HBInit();

room.pluginSpec = {
  name    : `test/disc-properties/updp`, // Update Player Disc Properties
};

/* * * * * * * * * *  VARIABLES  * * * * * * * * * */

/* * * * * * * * * *  FUNCIONES  * * * * * * * * * */

/* * * * * * * * * * * EVENTOS * * * * * * * * * * */

room.onGameStart        = onGameStartHandler;
room.onPositionsReset   = onPositionsResetHandler;
room.onPlayerTeamChange = onPlayerTeamChangeHandler;
room.onPlayerLeave      = onPlayerLeaveHandler;
