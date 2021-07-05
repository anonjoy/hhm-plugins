var room = HBInit();

room.pluginSpec = {
  name: `test/positions`,
  author: `mbappe`,
  version: `1.0.0`,
  config: {
    commandPrefix: `!`,
    hideCommands: 0,
    multiCommandPrefixHidesMessage: true,
  },
};

let currentMatch = {
  map : {
    id : null,
    wasSetted : false,
    enabledPositions : false,
    playerPerTeam : false,
  },
  positions : {
    1 : [], // Red
    2 : [], // Blue
  },
};

const positions = {
    2 : ["cp", "of"], // cp = capitan, of = ofensivo
    3 : ["gk", "cp", "of"],
    4 : ["gk", "df", "of", "cp"], // df= defensor
    5 : ["gk", "df", "mc", "of", "cp"], // mc = mediocampista
    6 : ["gk", "ld", "li", "mc", "dc", "ex"], // ex = extremo li = lat izq
    7 : ["gk", "ld", "li", "mc", "ei", "ed", "dc"] // ei = extremo izquierdo
}

const catalog = [];

class Catalog {
  this.addMap = function(code){
  }
}

class Map {
  constructor (index, code, numberOfPositions = false ) {
    this.index = index;
    this.code = JSON.parse(code);
    this.numberOfPositions = numberOfPositions;
    this.hasPositions = function(){
      return this.numberOfPositions ? true : false;
    }
    this.enabledPositions = this.hasPositions();
    this.getName = function(){
      return this.code.name;
    }
    
  }
    
  getName() {
      return this.code.name;
  }
    
  getMap() {
      return JSON.stringify(this.code);
  }
    
  hasPositions() {
      return this.numberOfPositions ? true : false;
  }
  
  setMap(force) {
    if (!force) {
      let state = room.getPlugin(`sav/game-state`);
      if (!state) return 1; //error
      if (state != 0) return 2;// error
    }
    else room.stopGame();
    room.setCustomStadium(this.getMap());
    room.triggerEvent("onSetMap", this.id, this.enabledPositions, this.numberOfPositions);
  }
}

function onSetMapHandler(id, enabled, amount) {
  currentMap.id = id;
  currentMap.wasSetted = true;
  if (!enabled || !amount) return;
  currentMap.enabledPositions = true;
  currentMap.playersPerTeam = amount;
  currentMap.positions = [];
}

let currentMap = {};

function onStadiumChangeHandler(newStadiumName, byPlayer) { // cuando el host pone el mapa el parametro 'byPlayer' devuelve 'null'
  if (!byPlayer) {
    currentMap.wasSetted = false;
    currentMap.enabledPositions = false;
    currentMap.playersPerTeam = false;
  }
}

function checkPositions() {
  let remaining = currentMap.positions.filter((pos) => !pos);
  if (remaining.length == 0) room.pauseGame(false);
}

function onPlayerChatHandler(player, pos) {
  if (!currentMap.wasSetted || !currentMap.enabledPositions) return;
  let index = positions[currentMap.playersPerTeam].indexOf(pos);
  if (index != -1) {
    currentMap.positions[index] = player.id;
    // El jugador tomó la posición 'positions[currentMap.playersPerTeam][pos]'
    checkPositions();
  }
}

function onGameStartHandler() {
  if (currentMap.wasSetted && currentMap.enabledPositions) room.pauseGame(true);
}

room.onSetMap = onSetMapHandler;
room.onPlayerChat = onPlayerChatHandler;
room.onGameStart = onGameStartHandler;
room.onStadiumChange = onStadiumChangeHandler;
