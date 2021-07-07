
var room = HBInit();

room.pluginSpec = {
  name: `test/disc-properties/pdpc`, // Player Disc Properties Commands
};

/* * * * * * * * * *  VARIABLES  * * * * * * * * * */

let playersDiscProperties = {};

const onCommandSizeHandlerData = {
  'sav/help': {
    text: ` SIZE_NUMBER, to change the size of your body.`,
    roles: config.defaultRole,
  },
};

const onCommandDiscHandlerData = {
  'sav/help': {
    text: ` [DISC_PROPERTY VALUE] PLAYER_ID (OPTIONAL), to change the properties of a player's body (Change your body if you don't pass PLAYER_ID parameter)`,
    roles: config.allowedRoles,
  },
};

const onCommandDiscResetHandlerData = {
  'sav/help': {
    text: ` PLAYER_ID/all (OPTIONAL), to reset the properties of player's body. (Reset your properties if you don't pass any parameter)`,
    roles: config.allowedRoles,
  },
};

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

/* * * * * * * * * *  FUNCIONES  * * * * * * * * * */

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

function onCommandDiscResetHandler ( player, arguments, argumentString ) {
  let argument = arguments[0];
  if (!argument && playersDiscProperties[player.id]) delete playersDiscProperties[player.id];
  else if ( isNaN(argument) && argument == 'all' ) playersDiscProperties = {};
  else !isNaN(argument) && room.getPlayerList().some((player) => player.id == argument) ? delete playersDiscProperties[argument] : error[3](player.id, argument);
  return false;
}

/** * * * ** * * *  * * * * * ** *  **/

function newPlayerDiscProperties(PLAYER_ID, {x, y, xspeed, yspeed, xgravity, ygravity, ...PLAYER_DISC_PROPERTIES}){
  if(!playersDiscProperties[PLAYER_ID]) playersDiscProperties[PLAYER_ID] = {};
  for (let [PROPERTY, VALUE] of Object.entries(PLAYER_DISC_PROPERTIES)){
    playersDiscProperties[PLAYER_ID][PROPERTY] = VALUE;
  }
  let GAME_STATE = room.getPlugin(`sav/game-state`).getGameState();
  if(GAME_STATE) room.setPlayerDiscProperties(PLAYER_ID, PLAYER_DISC_PROPERTIES);
}

function onCommandSizeHandler(player, arguments, argumentString){
  let SIZE_ARGUMENT = arguments[0];
  if(isNaN(SIZE_ARGUMENT)) return error; // EL ARGUMENTO NO ES UN NÚMERO
  let PLAYER_ROLES = room.getPlugin(`sav/roles`).getPlayerRoles(player.id);
  if(!PLAYER_ROLES) return error; // NO PUDO CARGAR EL MODULO
  let HAS_AUTHORIZED_ROLE = config.allowedRoles.some((AUTHORIZED_ROLE) => PLAYER_ROLES.includes(AUTHORIZED_ROLE));
  if((SIZE_ARGUMENT < DEFAULT_ROLE_MIN_SIZE || SIZE_ARGUMENT > DEFAULT_ROLE_MAX_SIZE) && !HAS_AUTHORIZED_ROLE) return error; // EL ARGUMENTO ESTA FUERA DE LOS LIMITES
  newPlayerDiscProperties(player.id, {'radius': SIZE_ARGUMENT});
  return false;
}

/* * * * * * * * * * * EVENTOS * * * * * * * * * * */

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
