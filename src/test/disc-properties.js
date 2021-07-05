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
    updateExceptions : ['x','y','xspeed','yspeed'],
    format : {
      error : { prefix: ``,style: `italic`, sound: 1, color: 0xFF0000 },
    },
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

const discProperties = {
  'x' : `float`,
  'y' : `float`,
  'xspeed' : `float`,
  'yspeed' : `float`,
  'xgravity' : `float`,
  'ygravity' : `float`,
  'radius' : `float`,
  'bCoeff' : `float`,
  'invMass' : `float`,
  'damping' : `float`,
  'color' : `int`,
  'cMask' : `int`,
  'cGroup' : `int`, 
  
};

let playersDiscProperties = {};

function updateDiscProperties () {
  for ( let [key, value] of Object.entries( playersDiscProperties ) ) {
    room.setPlayerDiscProperties(key, value);
  }
}

function onCommandDiscPropertiesHandler ( id, properties ) {
  if ( !playersDiscProperties[id] ) playersDiscProperties[id] = {};
  for ( let [key, value] of Object.entries( properties ) ) {
    if (!config.updateExceptions.includes(key)) playersDiscProperties[id][key] = value;
  }
  let state;
  state = getGameState();
  if ( state == 1 || state == 2 ) {
    room.setPlayerDiscProperties( id, properties );
  }
}

const onCommandDiscHandlerData = {
  'sav/help': {
    text: ` [DISC_PROPERTY VALUE] PLAYER_ID (OPTIONAL), to change the properties of a player's body (Change your body if you don't pass PLAYER_ID parameter)`,
    roles: config.allowedRoles,
  },
};

const error = {
  1 : (id, property) => {room.sendAnnouncement(`The argument ` + property + ` is not a valid property of discs.`, id, config.format.error);},
  2 : (id, property) => {room.sendAnnouncement(`The VALUE argument of the property ` + property + ` is not a valid value.`, id, config.format.error);},
  3 : (id, argID) => {room.sendAnnouncement(`The argument ` + argID + ` is not a valid ID.`, id, config.format.error);},
  4 : (id) => {room.sendAnnouncement(`DISC_PROPERTY and VALUE parameters are necessary.`, id, config.format.error);},
  5 : (id) => {room.sendAnnouncement(`The argument must be a number between ` + config.defaultMinSize + ` and ` + config.defaultMaxSize + `.`, id, config.format.error);},
};

function onCommandDiscHandler ( player, arguments, argumentString ) {
  if (!arguments[0] || !arguments[1]) return error[4](player.id);
  let properties = {};
  let property;
  let value;
  let length = arguments.length % 2 != 0 ? arguments.length - 1 : arguments.length;
  for (let i = 0; i < length; i+=2) {
    property = arguments[i];
    value = parseFloat(arguments[i+1]);
    if (!(property in discProperties)) {
      error[1](player.id, property);
      continue;
    }
    if (isNaN(value)) {
      error[2](player.id, property);
      continue;
    }
    if (discProperties[property] == `int` && !Number.isInteger(value)) {
      error[2](player.id, property);
      continue;
    }
    properties[property] = value;
  }
  let id = arguments.length % 2 != 0 ? arguments[arguments.length - 1] : player.id;
  !isNaN(id) && room.getPlayerList().some((player) => player.id == id) ? onCommandDiscPropertiesHandler(id, properties) : error[3](player.id, id);
  return false;
}

const onCommandSizeHandlerData = {
  'sav/help': {
    text: ` SIZE_NUMBER, to change the size of your body.`,
    roles: config.defaultRole,
  },
};

function onCommandSizeHandler ( player, arguments, argumentString ) {
  
  let argument = parseInt(arguments[0]);
  player.roles = roles.getPlayerRoles(player.id);
  
  if ( isNaN(argument) ) error[5](player.id);
  else if ( argument >= config.defaultMinSize && argument <= config.defaultMaxSize ) {
    onCommandDiscPropertiesHandler( player.id, { 'radius' : argument } );
  }
  else if ( config.allowedRoles.some((role) => player.roles.includes(role)) ) {
    onCommandDiscPropertiesHandler( player.id, { 'radius' : argument } );
  }
  else error[5](player.id);
  return false;
}

const onCommandDiscResetHandlerData = {
  'sav/help': {
    text: ` PLAYER_ID/all (OPTIONAL), to reset the properties of player's body. (Reset your properties if you don't pass any parameter)`,
    roles: config.allowedRoles,
  },
};

function onCommandDiscResetHandler ( player, arguments, argumentString ) {
  let argument = arguments[0];
  if (!argument && playersDiscProperties[player.id]) delete playersDiscProperties[player.id];
  else if ( isNaN(argument) && argument == 'all' ) playersDiscProperties = {};
  else !isNaN(argument) && room.getPlayerList().some((player) => player.id == argument) ? delete playersDiscProperties[argument] : error[3](player.id, argument);
  return false;
}

function onPlayerLeaveHandler ( player ) {
  if (playersDiscProperties[player.id]) delete playersDiscProperties[player.id];
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
room.onCommand_disc = {
  function: onCommandDiscHandler,
  data: onCommandDiscHandlerData,
};
room.onCommand_disc_reset = {
  function: onCommandDiscResetHandler,
  data: onCommandDiscResetHandlerData,
};
room.onPlayerLeave = onPlayerLeaveHandler;
room.onGameStart = onGameStartHandler;
room.onPositionsReset = onPositionsResetHandler;
room.onPlayerTeamChange = onPlayerTeamChangeHandler;
