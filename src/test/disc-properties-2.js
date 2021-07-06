var room = HBInit();

room.pluginSpec = {
  name    : `test/disc-properties`,
  config  : {},
};

/* * * * * * * * * * * CLASES * * * * * * * * * * */


/* * * * * * * * * *  VARIABLES  * * * * * * * * * */


/* * * * * * * * * *  FUNCIONES  * * * * * * * * * */

function saveDefaultPlayerDiscProperties(DISC_PROPERTIES_OF_SOME_PLAYER){
  
}

const non-persistent properties 

function filterDefaultPlayerDiscProperties({radius,bCoeff,invMass,damping,...rest}){
  return {radius,bCoeff,invMass,damping};
}

class Catalog {}

class Match {
  constructor(){
    /* * VARIBABLES * */
    const DEFAULT_STADIUMS                = [`Classic`, `Easy`, `Small`, `Big`, `Rounded`, `Hockey`, `Big Hockey`, `Big Easy`, `Big Rounded`, `Huge`];
    const DEFAULT_PLAYER_DISC_PROPERTIES  = { "radius" : 15, "bCoeff" : 0.5, "invMass" : 0.5, "damping" : 0.96 };
    let PLAYER_DISC_PROPERTIES;
    let STATE;
    let MAP_ID;
    let MAP_NAME;
    let MAP_WAS_SETTED;
    let WAITING_FOR_PLAYERS;
    /* * * METODOS * * */
    this.setMap = function(index, force = false){
      if(!force){
          switch(STATE){
            case 0: break; // GAME STOPPED
            case 1: case 2: return 1; // ERROR: GAME IS STARTED OR PAUSED
            default : return 2; // ERROR: PLUGIN NOT LOADED
          }
      }
      else room.stopGame();
      MAP_ID = index;
      room.setCustomStadium(CA[index].getStringCode);
    }
    this.getMap = () => MAP_ID;
    this.savePlayerDiscProperties = function({radius,bCoeff,invMass,damping,...rest}){
      PLAYER_DISC_PROPERTIES = {radius,bCoeff,invMass,damping};
    }
    this.getPlayerDiscProperties = () => PLAYER_DISC_PROPERTIES;
    this.savePlayerDiscProperties = function(){
    }
    /* * * EVENTOS * * */
    this.onPlayerTeamChange = function(changedPlayer, byPlayer){
      if(WAITING_FOR_PLAYERS){ 
        CM.savePlayerDiscProperties(room.getPlayerDiscProperties(changedPlayer.id)); 
        WAITING_FOR_PLAYERS = false;
      }
    }
    this.onGameStateChanged = (newState, ...args) => STATE = newState;
    this.onStadiumChange = function(newStadiumName, byPlayer){
      MAP_NAME = newStadiumName;
      if(byPlayer)  MAP_WAS_SETTED = true;
      else{         
                    MAP_WAS_SETTED = false; 
                    MAP_ID = null;
      }
      if(DEFAULT_STADIUMS.includes(MAP_NAME)) PLAYER_DISC_PROPERTIES = DEFAULT_PLAYER_DISC_PROPERTIES;
      else if(MAP_WAS_SETTED)                 CM.savePlayerDiscProperties(CA[MAP_ID].getCode().playerPhysics);
      else{
                                              PLAYER_DISC_PROPERTIES = null;
                                              WAITING_FOR_PLAYERS = true;
      }
    }
  }
}

const CM = new Match(); // Current Match
const CA = new Catalog(); // Catalog


function savePlayerDiscProperties(){
  let properties;
  if(mapWasSetted()) properties = getMapPlayersProperties();
  else {
    // IS THERE SOME PLAYER ON THE FIELD?
    let player = room.getPlayerList().find((player) => player.team != 0);
    if(player) match.map.saveDefaultPlayerDiscProperties(getPlayerDiscProperties(player.id));
    else properties waitingForPlayers();
  }
}

function onGameStartHandler(){
  savePlayerDiscProperties();
}

/* * * * * * * * * * * EVENTOS * * * * * * * * * * */

room.onGameStart = onGameStartHandler;