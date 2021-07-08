
var room = HBInit();

room.pluginSpec = {
  name: `...`,
};

const GAME = room.getPlugin(`test/game/core`).getGameObject();

const STATES = {
  STOPPED: 0,
  STARTED: 1,
  PAUSED: 2,
};

room.onGameStart    = () => GAME.setState(STATES.STARTED);
room.onGameStop     = () => GAME.setState(STATES.STOPPED);
room.onGamePause    = () => GAME.setState(STATES.PAUSED);
room.onGameUnpause  = () => GAME.setState(STATES.STARTED);
