var room = HBInit();

room.pluginSpec = {
  name: `...`,
};

/* * * * * * * * * * * CLASES  * * * * * * * * * * */

/* * * * * * * * * *  VARIABLES  * * * * * * * * * */

/* * * * * * * * * *  FUNCIONES  * * * * * * * * * */

function onPlayerTeamChange(({ previousFunction, callingPluginName }, changedPlayer, byPlayer, { myPlugin_level = 'default' } = {}))

/* * * * * * * * * * * EVENTOS * * * * * * * * * * */

room.onRoomLink = () => room.extend(`onPlayerTeamChange`, onPlayerTeamChange);
