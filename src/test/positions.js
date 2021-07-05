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

const positions = {
    2 : ["cp", "of"], // cp = capitan, of = ofensivo
    3 : ["gk", "cp", "of"],
    4 : ["gk", "df", "of", "cp"], // df= defensor
    5 : ["gk", "df", "mc", "of", "cp"], // mc = mediocampista
    6 : ["gk", "ld", "li", "mc", "dc", "ex"], // ex = extremo li = lat izq
    7 : ["gk", "ld", "li", "mc", "ei", "ed", "dc"] // ei = extremo izquierdo
}

function onPlayerChatHandler(player, argument) {
  if
}

room.onCommand0_cp = onCommandPositionHandler;
room.onCommand0_gk = onCommandPositionHandler;
room.onCommand0_df = onCommandPositionHandler;
room.onCommand0_li = onCommandPositionHandler;
room.onCommand0_ld = onCommandPositionHandler;
room.onCommand0_mc = onCommandPositionHandler;
room.onCommand0_of = onCommandPositionHandler;
room.onCommand0_ei = onCommandPositionHandler;
room.onCommand0_ex = onCommandPositionHandler;
room.onCommand0_ed = onCommandPositionHandler;
room.onCommand0_dc = onCommandPositionHandler;

let catalog = [];

class Map {
  constructor (index, code, numberOfPositions = false ) {
    this.index = index;
    this.code = JSON.parse(code);
    this.numberOfPositions = numberOfPositions;
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
  
  setMap() {
    let state = room.getPlugin(`sav/game-state`);
    if (!state) return; //error
    if (state != 0) return;// error
    room.setCustomStadium(this.getMap());
    
  }
}
