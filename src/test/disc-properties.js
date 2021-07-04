var room = HBInit();

room.pluginSpec = {
  name: `test/disc-properties`,
  author: `mbappe`,
  version: `1.0.0`,
  config: {
    defaultRole : ['user'],
    allowedRoles : ['host'],
    defaultMaxSize : 17,
    defaultMinSize : 12,
  },
  dependencies: [
    `sav/game-state`,
    `sav/commands`,
    `sav/roles`,
  ],
};

const config = room.getConfig();

const getGameState = room.getPlugin(`sav/game-state`).getGameState;

const roles = room.getPlugin(`sav/roles`);

let playersDiscProperties = {};

function updateDiscProperties () {
  for ( let [key, value] of Object.entries( playersDiscProperties ) ) {
    room.setPlayerDiscProperties(key, value);
  }
}

function onCommandDiscPropertiesHandler ( player, properties ) {
  if ( !playersDiscProperties[player.id] ) playersDiscProperties[player.id] = {};
  for ( let [key, value] of Object.entries( properties ) ) {
    playersDiscProperties[player.id][key] = value;
  }
  let state;
  state = getGameState();
  if ( state == 1 || state == 2 ) {
    room.setPlayerDiscProperties( player.id, properties );
  }
}

const onCommandSizeHandlerData = {
  'sav/help': {
    text: ` SIZE_NUMBER, to change the size of your body.`,
    roles: config.defaultRole,
  },
};

function onCommandSizeHandler ( player, arguments, argumentString ) {
  
  let argument = parseInt(arguments[0]);
  let error = `The argument must be between ` + config.defaultMinSize + ` and ` + config.defaultMaxSize + `.`;
  
  if ( isNaN(argument) ) return;
  if ( argument >= config.defaultMinSize && argument <= config.defaultMaxSize ) {
    onCommandDiscPropertiesHandler( player, { 'radius' : argument } );
  }
  else if ( roles.ensurePlayerRoles(player.id, config.allowedRoles, room, { 'message' : error }) ) {
    onCommandDiscPropertiesHandler( player, { 'radius' : argument } );
  }
}

function onPlayerLeaveHandler ( player ) {
  playersDiscProperties[player.id] ? (delete playersDiscProperties[player.id]) : false;
}

function onGameStartHandler () {
  updateDiscProperties();
}

function onPositionsResetHandler () {
  updateDiscProperties();
}

function onPlayerTeamChangeHandler ( player ) {
  let state = getGameState();
  if ( state == 1 || state == 2  ) updateDiscProperties();
}

room.onCommand1_size = {
  function: onCommandSizeHandler,
  data: onCommandSizeHandlerData,
};
room.onPlayerLeave = onPlayerLeaveHandler;
room.onGameStart = onGameStartHandler;
room.onPositionsReset = onPositionsResetHandler;
room.onPlayerTeamChange = onPlayerTeamChangeHandler;
