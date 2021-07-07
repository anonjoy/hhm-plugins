
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

function error(ERROR, PLAYER_ID, ARGUMENT){
  let MESSAGE = `The argument '` + ARGUMENT + `' is not a valid `;
  let FORMAT = config.format.error;
  switch(ERROR){
    case 0: room.sendAnnouncement(`DISC_PROPERTY and VALUE parameters are necessary.`, PLAYER_ID, FORMAT); break;
    case 1: room.sendAnnouncement(MESSAGE + `property of discs.`, PLAYER_ID, FORMAT); break;
    case 2: room.sendAnnouncement(MESSAGE + `value.`, PLAYER_ID, FORMAT); break;
    case 3: room.sendAnnouncement(MESSAGE + `ID.`, PLAYER_ID, FORMAT); break;
    case 4: room.sendAnnouncement(MESSAGE + `value. (Must be a number between ` + config.defaultMinSize + ` and ` + config.defaultMaxSize + `)`, PLAYER_ID, FORMAT); break;
  }
}

function onCommandDiscHandler ( player, arguments, argumentString ) {
  if (!arguments[0] || !arguments[1]) return error[4](player.id);
  let PROPERTIES = {};
  let PROPERTY;
  let VALUE;
  let LIMIT = arguments.length % 2 != 0 ? arguments.length - 1 : arguments.length;
  for (let i = 0; i < LIMIT; i+=2) {
    PROPERTY = arguments[i];
    VALUE = parseFloat(arguments[i+1]);
    if (!(PROPERTY in discProperties)) return error;
    if (isNaN(VALUE)) return error;
    if (discProperties[PROPERTY] == `int` && !Number.isInteger(VALUE)) return error;
    PROPERTIES[PROPERTY] = VALUE;
  }
  let PLAYER_ID = arguments.length % 2 != 0 ? arguments[LIMIT] : player.id;
  !isNaN(PLAYER_ID) && room.getPlayerList().some((player) => player.id == PLAYER_ID) ? newPlayerDiscProperties(PLAYER_ID, PROPERTIES) : error;
  return false;
}

const filterDiscProperties = ({x, y, xspeed, yspeed, ...DISC_PROPERTIES}) => DISC_PROPERTIES;

function newPlayerDiscProperties(PLAYER_ID, NEW_PLAYER_DISC_PROPERTIES){
  Object.assign({...playersDiscProperties[PLAYER_ID]} = {}, filterDiscProperties(NEW_PLAYER_DISC_PROPERTIES));
  let PLAYER_TEAM = room.getPlayer(PLAYER_ID).team;
  if(PLAYER_TEAM){
    let GAME_STATE = room.getPlugin(`sav/game-state`).getGameState();
    if(GAME_STATE) room.setPlayerDiscProperties(PLAYER_ID, NEW_PLAYER_DISC_PROPERTIES);
  }
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
