
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

const DISC_PROPERTIES_LIST = {
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
  return false;
}

function onCommandDiscHandler ( player, arguments, argumentString ) {
  let PROPERTIES = {};
  let PROPERTY = arguments[0];
  let VALUE = arguments[1];
  if (!PROPERTY || !VALUE) return error(0,player.id);
  let LIMIT = arguments.length % 2 != 0 ? arguments.length - 1 : arguments.length;
  for (let i = 0; i < LIMIT; i+=2) {
    PROPERTY = arguments[i];
    VALUE = arguments[i+1];
    if (!(PROPERTY in DISC_PROPERTIES_LIST)) return error(1,player.id,PROPERTY);
    if (isNaN(VALUE)) return error(2,player.id,VALUE);
    if (DISC_PROPERTIES_LIST[PROPERTY] == `int` && !Number.isInteger(parseFloat(VALUE))) return error(2,player.id,VALUE);
    PROPERTIES[PROPERTY] = VALUE;
  }
  let ID_ARGUMENT = arguments.length % 2 != 0 ? arguments[LIMIT] : player.id;
  !isNaN(ID_ARGUMENT) && room.getPlayerList().some((player) => player.id == ID_ARGUMENT) ? newPlayerDiscProperties(ID_ARGUMENT, PROPERTIES) : error(3,player.id,ID_ARGUMENT);
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

function onCommandDiscResetHandler(player, arguments, argumentString){
  let ID_ARGUMENT = arguments[0];
  if(isNaN(ID_ARGUMENT)) return error(3,player.id,ID_ARGUMENT);
  room.getPlayerList().some((player) => player.id == ID_ARGUMENT) ? delete playersDiscProperties[ID_ARGUMENT] : error[3](player.id, ID_ARGUMENT);
  return false;
}

function onCommandDiscResetHandler(player, arguments, argumentString){
  let ARGUMENT = arguments[0];
  if(!ARGUMENT && playersDiscProperties[player.id]) delete playersDiscProperties[player.id];
  else if(isNaN(ARGUMENT) && ARGUMENT == 'all') playersDiscProperties = {};
  else room.getPlayerList().some((player) => player.id == ARGUMENT) ? delete playersDiscProperties[ARGUMENT] : error[3](player.id, ARGUMENT);
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
room.onCommand1_disc_reset = {
  function: onCommandDiscResetHandler,
  data: onCommandDiscResetHandlerData,
};
room.onCommand0_disc_reset_all = {
  function: onCommandDiscResetHandler,
  data: onCommandDiscResetHandlerData,
};
