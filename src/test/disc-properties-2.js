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

class Match {
  constructor(){
    let DEFAULT_PLAYER_DISC_PROPERTIES;
    let MAP;
    this.setMap = function(){
    }
    this.getMap = function(){
    }
    this.savePlayerDiscProperties = function({radius,bCoeff,invMass,damping,...rest}){
      DEFAULT_PLAYER_DISC_PROPERTIES = {radius,bCoeff,invMass,damping};
    }
    this.getPlayerDiscProperties = () => DEFAULT_PLAYER_DISC_PROPERTIES;
    this.savePlayerDiscProperties = function(){
    }
  }
}

const CM = new Match(); // Current Match


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
