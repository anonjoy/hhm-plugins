var room = HBInit();

room.pluginSpec = {
  name: `test/ball-touch`,
  author: `mbappe`,
  version: `1.0.0`,
  config: {},
  configDescriptions: {},
  dependencies: [],
  order: {
    'onGameTick': {
      // Más velocidad para registrar los toques
      'before': [`sav/cron`],
  },
  incompatible_with: [],
};

var playersThatTouchedTheBall = [];

function pointDistance ( p1, p2 ){
  let d1 = p1.x - p2.x;
  let d2 = p1.y - p2.y;
  return Math.sqrt( d1 * d1 + d2 * d2 );
}

function onGameTickHandler () {
  // Filtro los jugadores que estan en el equipo rojo o azul.
  let players = room.getPlayerList().filter( (e) => e.team != 0 );
  // Agarro las coordenadas del centro de la bola
  let ballPosition = room.getBallPosition();
  // Agarro el radio de la bola (el radio difiere dependiendo el mapa)
  let ballRadius = room.getDiscProperties(0).radius;
  for ( let i = 0; i < players.length; i++ ) { // Iterate over all the players

    let player = players[i];
    
    // Agarro el radio del jugador (el radio difiere dependiendo el mapa)
    let playerRadius = room.getPlayerDiscProperties(player.id).radius;
    // Distancia maxima para decir que el jugador toco la bola.
    let triggerDistance = ballRadius + playerRadius + 0.01;
    // Calculo la distancia entre el centro del disco del jugador y el centro de la bola.
    let distanceToBall = pointDistance(player.position, ballPosition);
    let index = playersThatTouchedTheBall.indexOf( player.id );
    
    if ( playersThatTouchedTheBall.length > 3 ) playersThatTouchedTheBall.splice(3); // Quiero que mi lista tenga un maximo de 3 elementos
    // This check is here so that the event is only notified the first game tick in which the player is touching the ball.
    if ( distanceToBall < triggerDistance ) {
      if ( index != -1 ) {
        // Si el jugador esta en la lista lo saco y lo meto primero
        playersThatTouchedTheBall.splice(index, 1);
        playersThatTouchedTheBall.unshift( player.id );
        // room.sendAnnouncement( "[1] " + player.name + " touch the ball." ); // DEBUG
      }
      else {
        // Si no esta simplemente lo meto primero
        playersThatTouchedTheBall.unshift( player.id );
        // room.sendAnnouncement( "[2] " + player.name + " touch the ball." ); // DEBUG
      }
      // Activo el evento para que otros modulos puedan usarlo
      room.triggerEvent("onPlayerTouchTheBall", player, false );
    }
  }
}

function onPlayerBallKickHandler ( player ) {
  let index = playersThatTouchedTheBall.indexOf( player.id );
  if ( index != -1 ) {
    playersThatTouchedTheBall.splice( index, 1 );
    playersThatTouchedTheBall.unshift( player.id );
    // room.sendAnnouncement( "[1] " + player.name + " kick the ball." ); // DEBUG
  }
  else {
    playersThatTouchedTheBall.unshift( player.id );
    // room.sendAnnouncement( "[2] " + player.name + " kick the ball." ); // DEBUG
  }
  room.triggerEvent("onPlayerTouchTheBall", player, true );
}

function onPositionsResetHandler () {
  playersThatTouchedTheBall = [];
}

function onGameStopHandler () {
  playersThatTouchedTheBall = [];
}

function getLastPlayersWhoTouchedTheBall () {
  // devuelvo el array duplicado
  return [...playersThatTouchedTheBall];
}

room.onPlayerBallKick = onPlayerBallKickHandler;
room.onGameTick = onGameTickHandler;
room.onPositionsReset = onPositionsResetHandler;
room.onGameStop = onGameStopHandler;
room.getLastPlayersWhoTouchedTheBall = getLastPlayersWhoTouchedTheBall;
