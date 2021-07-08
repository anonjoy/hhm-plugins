
var room = HBInit();

room.pluginSpec = {
  name: `...`,
};

const GM = room.getPlugin(`test/game/core`).getGameObject();

const STATES = {
  STOPPED: 0,
  STARTED: 1,
  PAUSED: 2,
};

room.onGameStart    = () => GM.setGameState(STATES.STARTED);
room.onGameStop     = () => GM.setGameState(STATES.STOPPED);
room.onGamePause    = () => GM.setGameState(STATES.PAUSED);
room.onGameUnpause  = () => GM.setGameState(STATES.STARTED);
