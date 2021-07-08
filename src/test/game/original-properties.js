

var room = HBInit();

room.pluginSpec = {
  name: `...`,
};

/* * * * * * * * * *  VARIABLES  * * * * * * * * * */

const GAME = room.getPlugin(`test/game/core`).getGameObject();

/* * * * * * * * * *  FUNCIONES  * * * * * * * * * */

const filterDiscProperties = ({x, y, xspeed, yspeed, ...DISC_PROPERTIES}) => DISC_PROPERTIES;

function onStadiumChangeHandler(newStadiumName, byPlayer){
  GAME.setOriginalPlayerDiscProperties(1, null);
  GAME.setOriginalPlayerDiscProperties(2, null);
  GAME.setOriginalBallProperties(null);
}

function onGameStartHandler(){
  if(!GAME.getOriginalBallProperties()) GAME.setOriginalBallProperties(filterDiscProperties(room.getDiscProperties(0)));
  if(!GAME.getOriginalPlayerDiscProperties(1)){
    let RED_PLAYER  = room.getPlayerList().find((player) => player.team == 1);
    if(RED_PLAYER)  GAME.setOriginalPlayerDiscProperties(1, filterDiscProperties(room.getPlayerDiscProperties(RED_PLAYER.id))); // if !== undefined
  }
  if(!GAME.getOriginalPlayerDiscProperties(2)){
    let BLUE_PLAYER = room.getPlayerList().find((player) => player.team == 2);
    if(BLUE_PLAYER) GAME.setOriginalPlayerDiscProperties(2, filterDiscProperties(room.getPlayerDiscProperties(BLUE_PLAYER.id))); // if !== undefined
  }
}

function onPlayerTeamChangeHandler(changedPlayer, byPlayer){
  if(changedPlayer.team && !GAME.getOriginalPlayerDiscProperties(changedPlayer.team)){
    if(GAME.getState()) GAME.setOriginalBallProperties(changedPlayer.team, filterDiscProperties(room.getPlayerDiscProperties(changedPlayer.id))); // if !== 0 || !== undefined
  }
}

/* * * * * * * * * * * EVENTOS * * * * * * * * * * */

room.onRoomLink         = onStadiumChangeHandler; // CUANDO SE INICIA EL HEADLESS HOST
room.onStadiumChange    = onStadiumChangeHandler;
room.onGameStart        = onGameStartHandler;
room.onPlayerTeamChange = onPlayerTeamChangeHandler;
