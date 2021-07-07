
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
  if(changedPlayer.team != 0 && playersDiscProperties[changedPlayer.id]){
    let GAME_STATE = room.getPlugin(`sav/game-state`).getGameState;
    if (GAME_STATE){
      let PLAYER_DISC_PROPERTIES = room.getPlugin(`test/disc-properties/dpc`).getPlayersDiscProperties();
       room.setPlayerDiscProperties(changedPlayer.id, playersDiscProperties[changedPlayer.id]);
    }
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
