var room = HBInit();

room.pluginSpec = {
  name: `test2/password`,
  author: `mbappe`,
  version: `1.0.0`,
  config: {
    // Roles that can use the in room commands.
    allowedRoles : ['host'],
  },
  dependencies: [
    `sav/roles`,
    `sav/commands`,
  ],
};

const config = room.getConfig();

const onCommandPasswordHandlerData = {
  'sav/help': {
    text: ` PASSWORD`,
    roles: config.allowedRoles,
  },
};

function onCommandPasswordHandler ( player, arguments, argumentString ) {
  let roles = room.getPlugin(`sav/roles`);
  if ( !roles ) return;
  if ( roles.ensurePlayerRoles( player.id, config.allowedRoles, room ) ) {
    room.setPassword( arguments[0] );
    room.sendAnnouncement(`Password has been set!`, null, 0xFF0000);
    return false;
  }
}

const onCommandClearPasswordHandlerData = {
  'sav/help': {
    roles: config.allowedRoles,
  },
};

function onCommandClearPasswordHandler ( player ) {
  let roles = room.getPlugin(`sav/roles`);
  if ( !roles ) return;
  if ( roles.ensurePlayerRoles( player.id, config.allowedRoles, room ) ) {
    room.setPassword( null );
    room.sendAnnouncement(`Password has been cleared!a`, null, 0x00FF00);
    return false;
  }
}

room.onCommand1_password = {
  function: onCommandPasswordHandler,
  data: onCommandPasswordHandlerData,
};

room.onCommand0_clear_password = {
  function: onCommandClearPasswordHandler,
  data: onCommandClearPasswordHandlerData,
};
