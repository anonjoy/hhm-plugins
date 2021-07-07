
var room = HBInit();

room.pluginSpec = {
  name    : `test/disc-properties/updp`, // Update Player Disc Properties
};

/* * * * * * * * * *  VARIABLES  * * * * * * * * * */

/* * * * * * * * * *  FUNCIONES  * * * * * * * * * */

function updateDiscProperties () {
  for ( let [key, value] of Object.entries( playersDiscProperties ) ) {
    room.setPlayerDiscProperties(key, value);
  }
}

function onPlayerLeaveHandler ( player ) {
  if (playersDiscProperties[player.id]) delete playersDiscProperties[player.id];
}

function onGameStartHandler () {
  updateDiscProperties();
}

function onPositionsResetHandler () {
  updateDiscProperties();
}

function onPlayerTeamChangeHandler (changedPlayer, byPlayer) {
  let GAME_STATE = room.getPlugin(`sav/game-state`).getGameState;
  if (GAME_STATE && changedPlayer.team != 0) updateDiscProperties();
}

/* * * * * * * * * * * EVENTOS * * * * * * * * * * */

room.onGameStart        = onGameStartHandler;
room.onPositionsReset   = onPositionsResetHandler;
room.onPlayerTeamChange = onPlayerTeamChangeHandler;
room.onPlayerLeave      = onPlayerLeaveHandler;
