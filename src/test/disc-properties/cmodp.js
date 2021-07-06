
var room = HBInit();

room.pluginSpec = {
  name    : `test/disc-properties/cmodp`, // Current Map Original Disc Properties
};

/* * * * * * * * * *  VARIABLES  * * * * * * * * * */

let PLAYER_DISC_PROPERTIES;
let BALL_PROPERTIES;

/* * * * * * * * * *  FUNCIONES  * * * * * * * * * */

const filterProperties                = ({radius, bCoeff, invMass, damping}) => ({radius, bCoeff, invMass, damping});
const getOriginalPlayerDiscProperties = () => PLAYER_DISC_PROPERTIES;
const getOriginalBallProperties       = () => BALL_PROPERTIES;

function onStadiumChangeHandler(newStadiumName, byPlayer){
  PLAYER_DISC_PROPERTIES  = null;
  BALL_PROPERTIES         = null;
}

function onGameStartHandler(){
  if(!BALL_PROPERTIES) BALL_PROPERTIES = room.getDiscProperties(0);
  if(!PLAYER_DISC_PROPERTIES){
    let player = room.getPlayerList().find((player) => player.team != 0);
    if(player) PLAYER_DISC_PROPERTIES = filterProperties(room.getPlayerDiscProperties(changedPlayer.id));
  }
}

function onPlayerTeamChangeHandler(changedPlayer, byPlayer){
  if(!PLAYER_DISC_PROPERTIES){
    let GAME_STATE = room.getPlugin(`sav/game-state`).getGameState;
    if(GAME_STATE && changedPlayer.team != 0) PLAYER_DISC_PROPERTIES = filterProperties(room.getPlayerDiscProperties(changedPlayer.id));
  }
}

/* * * * * * * * * * * EVENTOS * * * * * * * * * * */

room.onStadiumChange    = onStadiumChangeHandler;
room.onGameStart        = onGameStartHandler;
room.onPlayerTeamChange = onPlayerTeamChangeHandler;
