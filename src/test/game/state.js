
var room = HBInit();

room.pluginSpec = {
  name: `...`,
};

const GM = room.getPlugin(`test/game/core`).getGameObject();

room.onGameStart    = () => GM.setGameState(1);
room.onGameStop     = () => GM.setGameState(0);
room.onGamePause    = () => GM.setGameState(2);
room.onGameUnpause  = () => GM.setGameState(1);
