
var room = HBInit();

room.pluginSpec = {
  name: `...`,
};

const STATES = {
  STOPPED: 0,
  STARTED: 1,
  PAUSED: 2,
};

function onGameStartHandler(...args) {
  triggerGameStateChange(states.STARTED, `onGameStart`, ...args);
}

function onGameStopHandler(...args) {
  triggerGameStateChange(states.STOPPED, `onGameStop`, ...args);
}

function onGamePauseHandler(...args) {
  triggerGameStateChange(states.PAUSED, `onGamePause`, ...args);
}

function onGameUnpauseHandler(...args) {
  triggerGameStateChange(states.STARTED, `onGameUnpause`, ...args);
}

function triggerGameStateChange(newState, nativeEventName, ...args) {
  const previousState = state;
  state = newState;

  room.triggerEvent(`onGameStateChanged`, newState, previousState,
      { name: nativeEventName, args });
}

function getGameState() {
  return state;
}


// room.states = states;
room.onGameStart = onGameStartHandler;
room.onGameStop = onGameStopHandler;
room.onGamePause = onGamePauseHandler;
room.onGameUnpause = onGameUnpauseHandler;
room.getGameState = getGameState;
