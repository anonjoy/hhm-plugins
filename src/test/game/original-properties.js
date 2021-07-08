

var room = HBInit();

room.pluginSpec = {
  name: `...`,
};

/* * * * * * * * * *  VARIABLES  * * * * * * * * * */

const GM = room.getPlugin(`test/game/core`).getGameObject();

/* * * * * * * * * *  FUNCIONES  * * * * * * * * * */

const filterDiscProperties = ({x, y, xspeed, yspeed, ...DISC_PROPERTIES}) => DISC_PROPERTIES;

function onStadiumChangeHandler(newStadiumName, byPlayer){
  GM.setOriginalPlayerDiscProperties(1, null);
  GM.setOriginalPlayerDiscProperties(2, null);
  GM.setOriginalBallProperties(null);
}

function onGameStartHandler(){
  if(!GM.getOriginalBallProperties()) GM.setOriginalBallProperties(filterDiscProperties(room.getDiscProperties(0)));
  if(!GM.getOriginalPlayerDiscProperties(1)) GM.setOriginalPlayerDiscProperties(1, filterDiscProperties(room.getPlayerDiscProperties(room.getPlayerList().find((player) => player.team == 1))));
  if(!GM.getOriginalPlayerDiscProperties(2)) GM.setOriginalPlayerDiscProperties(2, filterDiscProperties(room.getPlayerDiscProperties(room.getPlayerList().find((player) => player.team == 2))));
  // `getPlayerDiscProperties` devuelve `null` si no encuentra al jugador
}

function onPlayerTeamChangeHandler(changedPlayer, byPlayer){
  if(changedPlayer.team && !GM.getOriginalPlayerDiscProperties(changedPlayer.team) && GM.getGameState()) GM.setOriginalBallProperties(changedPlayer.team, filterDiscProperties(room.getPlayerDiscProperties(changedPlayer.id)));
}

/* * * * * * * * * * * EVENTOS * * * * * * * * * * */

room.onRoomLink         = onStadiumChangeHandler; // CUANDO SE INICIA EL HEADLESS HOST
room.onStadiumChange    = onStadiumChangeHandler;
room.onGameStart        = onGameStartHandler;
room.onPlayerTeamChange = onPlayerTeamChangeHandler;
