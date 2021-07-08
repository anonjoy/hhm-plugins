
var room = HBInit();

room.pluginSpec = {
  name: `...`,
};

/* * * * * * * * * *  VARIABLES  * * * * * * * * * */

const GM = room.getPlugin(`test/game/core`).getGameObject();

/* * * * * * * * * * * EVENTOS * * * * * * * * * * */

room.onGameStart    = () => GM.setGameState(1);
room.onGameStop     = () => GM.setGameState(0);
room.onGamePause    = () => GM.setGameState(2);
room.onGameUnpause  = () => GM.setGameState(1);
