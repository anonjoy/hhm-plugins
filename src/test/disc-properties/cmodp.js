
var room = HBInit();

room.pluginSpec = {
  name: `test/disc-properties/cmodp`, // Current Map Original Disc Properties
};

/* * * * * * * * * *  VARIABLES  * * * * * * * * * */

const TEAM_ID = { SPEC: 0, RED: 1, BLUE: 2};
let ORIGINAL_PLAYER_DISC_PROPERTIES = {};
let ORIGINAL_BALL_PROPERTIES;

/* * * * * * * * * *  FUNCIONES  * * * * * * * * * */

const filterDiscProperties            = ({x, y, xspeed, yspeed, ...DISC_PROPERTIES}) => DISC_PROPERTIES;
const getOriginalPlayerDiscProperties = (TEAM) => ORIGINAL_PLAYER_DISC_PROPERTIES[TEAM];
const getOriginalBallProperties       = () => ORIGINAL_BALL_PROPERTIES;

function onStadiumChangeHandler(newStadiumName, byPlayer){
  ORIGINAL_PLAYER_DISC_PROPERTIES = {};
  ORIGINAL_BALL_PROPERTIES        = null;
}

function onGameStartHandler(){
  if(!ORIGINAL_BALL_PROPERTIES) ORIGINAL_BALL_PROPERTIES = filterDiscProperties(room.getDiscProperties(0));
  if(ORIGINAL_PLAYER_DISC_PROPERTIES === {}){
    let PLAYER_LIST = room.getPlayerList();
    let RED_PLAYER  = PLAYER_LIST.find((player) => player.team === TEAM_ID.RED);
    let BLUE_PLAYER = PLAYER_LIST.find((player) => player.team === TEAM_ID.BLUE);
    if(RED_PLAYER)  ORIGINAL_PLAYER_DISC_PROPERTIES[TEAM_ID.RED]  = filterDiscProperties(room.getPlayerDiscProperties(RED_PLAYER.id));
    if(BLUE_PLAYER) ORIGINAL_PLAYER_DISC_PROPERTIES[TEAM_ID.BLUE] = filterDiscProperties(room.getPlayerDiscProperties(BLUE_PLAYER.id));
  }
}


function onPlayerTeamChangeHandler(changedPlayer, byPlayer){
  if(changedPlayer.team != 0 && !ORIGINAL_PLAYER_DISC_PROPERTIES[changedPlayer.team]){
    let GAME_STATE = room.getPlugin(`sav/game-state`).getGameState();
    if(GAME_STATE) = ORIGINAL_PLAYER_DISC_PROPERTIES[changedPlayer.team] = filterDiscProperties(room.getPlayerDiscProperties(changedPlayer.id));
  }
}

/* * * * * * * * * * * EVENTOS * * * * * * * * * * */

room.onStadiumChange    = onStadiumChangeHandler;
room.onGameStart        = onGameStartHandler;
room.onPlayerTeamChange = onPlayerTeamChangeHandler;
