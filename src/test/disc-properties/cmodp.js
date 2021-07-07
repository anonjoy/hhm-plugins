
var room = HBInit();

room.pluginSpec = {
  name: `test/disc-properties/cmodp`, // Current Map Original Disc Properties
};

/* * * * * * * * * *  VARIABLES  * * * * * * * * * */

let ORIGINAL_PLAYER_DISC_PROPERTIES;
let ORIGINAL_BALL_PROPERTIES;

/* * * * * * * * * *  FUNCIONES  * * * * * * * * * */

const filterProperties                = ({radius, bCoeff, invMass, damping}) => ({radius, bCoeff, invMass, damping});
const getOriginalPlayerDiscProperties = () => ORIGINAL_PLAYER_DISC_PROPERTIES;
const getOriginalBallProperties       = () => ORIGINAL_BALL_PROPERTIES;

function onStadiumChangeHandler(newStadiumName, byPlayer){
  ORIGINAL_PLAYER_DISC_PROPERTIES  = null;
  ORIGINAL_BALL_PROPERTIES         = null;
}

function onGameStartHandler(){
  if(!ORIGINAL_BALL_PROPERTIES) ORIGINAL_BALL_PROPERTIES = room.getDiscProperties(0);
  if(!ORIGINAL_PLAYER_DISC_PROPERTIES){
    let player = room.getPlayerList().find((player) => player.team != 0);
    if(player) ORIGINAL_PLAYER_DISC_PROPERTIES = filterProperties(room.getPlayerDiscProperties(player.id));
  }
}

function onPlayerTeamChangeHandler(changedPlayer, byPlayer){
  if(!ORIGINAL_PLAYER_DISC_PROPERTIES){
    let GAME_STATE = room.getPlugin(`sav/game-state`).getGameState;
    if(GAME_STATE && changedPlayer.team != 0) ORIGINAL_PLAYER_DISC_PROPERTIES = filterProperties(room.getPlayerDiscProperties(changedPlayer.id));
  }
}

/* * * * * * * * * * * EVENTOS * * * * * * * * * * */

room.onStadiumChange    = onStadiumChangeHandler;
room.onGameStart        = onGameStartHandler;
room.onPlayerTeamChange = onPlayerTeamChangeHandler;
