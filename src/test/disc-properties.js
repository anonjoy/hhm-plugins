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
    playersDiscProperties[id][key] = value;
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
  1 : (property) => {room.sendAnnouncement(`The argument ` + property + ` is not a valid property of discs.`);},
  2 : (property, value) => {room.sendAnnouncement(`The argument ` + value + ` is not a valid value for the property ` + property + `.`);},
  3 : (id) => {room.sendAnnouncement(`The argument ` + id + ` is not a valid ID.`);},
  4 : () => {room.sendAnnouncement(`DISC_PROPERTY and VALUE parameters are necessary.`);},
};

function onCommandDiscHandler ( player, arguments, argumentString ) {
  if (!arguments[0] || !arguments[1]) error[4]();
  let properties = {};
  let property;
  let value;
  for (let i = 0; i < arguments.length; i+=2) {
    property = arguments[i];
    value = parseFloat(arguments[i+1]);
    if (!(property in discProperties)) {
      error[1](property);
      continue;
    }
    if (isNaN(value)) {
      error[2](property, value);
      continue;
    }
    if (discProperties[property] == `int` && !Number.isInteger(value)) {
      error[2](property, value);
      continue;
    }
    properties[property] = value;
  }
  let id = arguments.length % 2 != 0 ? arguments[arguments.length - 1] : player.id;
  room.getPlayerList().some((player) => player.id == id) ? onCommandDiscPropertiesHandler(id, properties) : error[3](id);
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
    onCommandDiscPropertiesHandler( player.id, { 'radius' : argument } );
  }
  else if ( roles.ensurePlayerRoles(player.id, config.allowedRoles, room, { 'message' : error }) ) {
    onCommandDiscPropertiesHandler( player.id, { 'radius' : argument } );
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
room.onCommand_disc = {
  function: onCommandDiscHandler,
  data: onCommandDiscHandlerData,
};
room.onPlayerLeave = onPlayerLeaveHandler;
room.onGameStart = onGameStartHandler;
room.onPositionsReset = onPositionsResetHandler;
room.onPlayerTeamChange = onPlayerTeamChangeHandler;
