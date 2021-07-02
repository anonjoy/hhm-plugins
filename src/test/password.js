var room = HBInit();

room.pluginSpec = {
  name: `test/password`,
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

let help = room.getPlugin(`sav/help`);
if ( help ) {
  help.registerHelp( `password`, `PASSWORD`, { numArgs: 1, roles: config.allowedRoles } );
  help.registerHelp( `clearpassword`, ``, { numArgs: 0, roles: config.allowedRoles } );
}

room.onCommand1_password = function ( player, arguments, argumentString ) {
  let roles = room.getPlugin(`sav/roles`);
  if ( !roles ) return;
  if ( roles.ensurePlayerRoles( player.id, config.allowedRoles, room ) ) {
    room.setPassword( arguments[0] );
    room.sendAnnouncement(`Password has been set!`, null, 0xFF0000);
  }
}

room.onCommand0_clearpassword = function ( player ) {
  let roles = room.getPlugin(`sav/roles`);
  if ( !roles ) return;
  if ( roles.ensurePlayerRoles( player.id, config.allowedRoles, room ) ) {
    room.setPassword( null );
    room.sendAnnouncement(`Password has been cleared!`, null, 0x00FF00);
  }
}
