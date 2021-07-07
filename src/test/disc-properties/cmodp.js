
var room = HBInit();

room.pluginSpec = {
  name: `test/disc-properties/cmodp`, // Current Map Original Disc Properties
};

/* * * * * * * * * *  VARIABLES  * * * * * * * * * */

const TEAM = { SPEC: 0, RED: 1, BLUE: 2};
let ORIGINAL_PLAYER_DISC_PROPERTIES = {};



let ORIGINAL_BALL_PROPERTIES;

/* * * * * * * * * *  FUNCIONES  * * * * * * * * * */

function filterProperties(PLAYER_TEAM, {x, y, xspeed, yspeed, color, ...PLAYER_DISC_PROPERTIES}){
  switch(PLAYER_TEAM){
    case 1: case 2: return PLAYER_DISC_PROPERTIES;
  }
}

const getOriginalPlayerDiscProperties = (PLAYER_TEAM) => ORIGINAL_PLAYER_DISC_PROPERTIES[PLAYER_TEAM];
const getOriginalBallProperties       = () => ORIGINAL_BALL_PROPERTIES;

function onStadiumChangeHandler(newStadiumName, byPlayer){
  ORIGINAL_PLAYER_DISC_PROPERTIES = {}
  ORIGINAL_BALL_PROPERTIES        = null;
}

function onGameStartHandler(){
  if(!ORIGINAL_BALL_PROPERTIES) ORIGINAL_BALL_PROPERTIES = room.getDiscProperties(0);
  if(ORIGINAL_PLAYER_DISC_PROPERTIES === {}){
    let player = room.getPlayerList().find((player) => player.team != 0);
  }
  if(!ORIGINAL_PLAYER_DISC_PROPERTIES[TEAM.RED] || !ORIGINAL_PLAYER_DISC_PROPERTIES[TEAM.BLUE]){
    let player = room.getPlayerList().find((player) => player.team != 0);
    if(player) ORIGINAL_PLAYER_DISC_PROPERTIES[player.team] = filterProperties(room.getPlayerDiscProperties(player.id));
  }
}

function onPlayerTeamChangeHandler(changedPlayer, byPlayer){
  if(!ORIGINAL_PLAYER_DISC_PROPERTIES[changedPlayer.team]){
  }
  if(!getOriginalPlayerDiscProperties(changedPlayer.team)){
    let GAME_STATE = room.getPlugin(`sav/game-state`).getGameState();
    if(GAME_STATE){
      switch(changedPlayer.team){
        case 1: ORIGINAL_RED_PLAYER_DISC_PROPERTIES   = filterProperties(room.getPlayerDiscProperties(changedPlayer.id));
        case 2: ORIGINAL_BLUE_PLAYER_DISC_PROPERTIES  = filterProperties(room.getPlayerDiscProperties(changedPlayer.id));
      }
    }
  }
}

/* * * * * * * * * * * EVENTOS * * * * * * * * * * */

room.onStadiumChange    = onStadiumChangeHandler;
room.onGameStart        = onGameStartHandler;
room.onPlayerTeamChange = onPlayerTeamChangeHandler;
