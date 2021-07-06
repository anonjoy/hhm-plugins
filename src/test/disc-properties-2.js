var room = HBInit();

room.pluginSpec = {
  name    : `test/disc-properties`,
  config  : {},
};

/* * * * * * * * * * * CLASES * * * * * * * * * * */


/* * * * * * * * * *  VARIABLES  * * * * * * * * * */


/* * * * * * * * * *  FUNCIONES  * * * * * * * * * */

let catalog = [];

class Match {
  constructor(){
    /* * VARIBABLES * */
    let PLAYER_DISC_PROPERTIES;
    let BALL_PROPERTIES;
    let GAME_STATE;
    let MAP_ID;
    let MAP_NAME;
    let MAP_WAS_SETTED;
    /* * * METODOS * * */
    this.setMap = function(index, force = false){
      if(!force){
          switch(GAME_STATE){
            case 0: break; // GAME STOPPED
            case 1: case 2: return 1; // ERROR: GAME IS STARTED OR PAUSED
            default : return 2; // ERROR: PLUGIN NOT LOADED
          }
      }
      else room.stopGame();
      MAP_ID = index;
      room.setCustomStadium(catalog[index].getStringCode);
    }
    this.getMap = () => MAP_ID;
    this.savePlayerDiscProperties = function({radius,bCoeff,invMass,damping,...rest}){
      PLAYER_DISC_PROPERTIES = {radius,bCoeff,invMass,damping};
    }
    this.getPlayerDiscProperties = () => PLAYER_DISC_PROPERTIES;
    this.getBallProperties = () => BALL_PROPERTIES;
    /* * * EVENTOS * * */
    this.onGameStart = function(){
      if(!BALL_PROPERTIES) BALL_PROPERTIES = room.getDiscProperties(0);
      if(!PLAYER_DISC_PROPERTIES){
        let player = room.getPlayerList().find((player) => player.team != 0);
        if(player) CM.savePlayerDiscProperties(getPlayerDiscProperties(player.id));
      }
    }
    this.onPlayerTeamChange = function(changedPlayer, byPlayer){
      if(!PLAYER_DISC_PROPERTIES && (GAME_STATE === 1 || GAME_STATE === 2) && changedPlayer.team != 0) CM.savePlayerDiscProperties(room.getPlayerDiscProperties(changedPlayer.id)); 
    }
    this.onGameStateChanged = (newState, ...args) => GAME_STATE = newState;
    this.onStadiumChange = function(newStadiumName, byPlayer){
      MAP_NAME                = newStadiumName;
      PLAYER_DISC_PROPERTIES  = null;
      BALL_PROPERTIES         = null;
      if(byPlayer)  MAP_WAS_SETTED  = true;
      else{         
                    MAP_WAS_SETTED  = false; 
                    MAP_ID          = null;
      }
    }
  }
}

const CM = new Match(); // Current Match

/* * * * * * * * * * * EVENTOS * * * * * * * * * * */

room.onGameStart = onGameStartHandler;
