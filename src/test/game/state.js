
var room = HBInit();

room.pluginSpec = {
  name: `...`,
};

const GAME = room.getPlugin(`test/game/core`).getGameObject();

room.onGameStart    = () => GAME.setState(1);
room.onGameStop     = () => GAME.setState(0);
room.onGamePause    = () => GAME.setState(2);
room.onGameUnpause  = () => GAME.setState(1);
