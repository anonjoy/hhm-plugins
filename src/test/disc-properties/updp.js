
var room = HBInit();

room.pluginSpec = {
  name: `test/disc-properties/updp`, // Update Player Disc Properties
};

/* * * * * * * * * *  VARIABLES  * * * * * * * * * */

/* * * * * * * * * *  FUNCIONES  * * * * * * * * * */

function updateDiscProperties () {
  for (let [PLAYER_ID, PROPERTIES] of Object.entries(playersDiscProperties)){
    room.setPlayerDiscProperties(key, value);
  }
}

function onGameStartHandler(){
  updateDiscProperties();
}
function onPositionsResetHandler(){
  updateDiscProperties();
}

function onPlayerTeamChangeHandler(changedPlayer, byPlayer){
  let PLAYER_DISC_PROPERTIES = room.getPlugin(`test/disc-properties/dpc`).getPlayersDiscProperties(changedPlayer.id);
  if(changedPlayer.team != 0 && PLAYER_DISC_PROPERTIES){
    let GAME_STATE =  room.getPlugin(`sav/game-state`).getGameState;
    if (GAME_STATE)   room.setPlayerDiscProperties(changedPlayer.id, PLAYER_DISC_PROPERTIES); // if !== 0 || !== undefined
  }
}

function onPlayerLeaveHandler(player){
  if (playersDiscProperties[player.id]) delete playersDiscProperties[player.id];
}

/* * * * * * * * * * * EVENTOS * * * * * * * * * * */

room.onGameStart        = onGameStartHandler;
room.onPositionsReset   = onPositionsResetHandler;
room.onPlayerTeamChange = onPlayerTeamChangeHandler;
room.onPlayerLeave      = onPlayerLeaveHandler;
