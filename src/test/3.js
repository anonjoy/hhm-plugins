/*

var object = {
    1: [2,5,"hi"],
    hi: {hihi: 1}
};

console.log(object);

var strobj = JSON.stringify(object);

console.log(strobj); // es un string ahora

var unstrobj = JSON.parse(strobj);

console.log(unstrobj); // vuelve a ser un objeto

*/



neededPlayers = {red: 0, blue: 0}

let unObjeto = {
  cantidadJugadores: 0, // Jugadores por mapa x
  mapaNombre: '', // Futsal x4,x5,x6,x7
  mapaCodigo: '', // Mapa del futsal
  posBlue: [], // Posiciones del equipo Blue
  posRed: [], // Posiciones del equipo Red
}

class Mapa {
  constructor (playersPerTeam, identifier){
    this.playersPerTeam = playersPerTeam;
    this.identifier = identifier;
    this.map = this.getMap();
    this.positions = {
      1 : this.getPos(), // Red Team
      2 : this.getPos(), // Blue Team
    };
  }
  
  getPos(){
    let arr = []
    for (let i = 0; i < this.playersPerTeam; i++){
      arr.push(-1);
    }
    return arr
  }
  
  getMap(){
    room.stopGame();
    room.setCustomStadium(codigo);
  }
  
}






let positions = {
    x2: ["cp", "of"], // cp = capitan, of = ofensivo
    x3: ["gk", "cp", "of"],
    x4: ["gk", "df", "of", "cp"], // df= defensor
    x5: ["gk", "df", "mc", "of", "cp"], // mc = mediocampista
    x6: ["gk", "ld", "li", "mc", "dc", "ex"], // ex = extremo li = lat izq
    x7: ["gk", "ld", "li", "mc", "ei", "ed", "dc"] // ei = extremo izquierdo
}
/*



Si jugador escribe !gk 
Asignar posBlue1[0] = idDelJugador
Si escribe !ed y mapa = x5
Imprimir 'No se puede seleccionar esa posicion en un mapa x5'


ejemplo
positions[x3].includes(message.replace('!', ''))
si el jugador escribe "df", entonces no va a estar incluido

room.onPlayerChat = function (player, message) {
  if ( !AllPositionsHaveBeenTaken ) {
    let index = positions[xFutsal].indexOf(message.replace('!', ''));
    if ( index != -1 ) {
      currentMap.positions[player.team][index] = player.id;
      if ( !currentMap.positions[player.team].includes(0) ) AllPositionsHaveBeenTaken = True;
    }
  }
}

room.onGameStart = function () {
  AllPositionsHaveBeenTaken = False;
}

room.onGameStop = function () {
}

*/

let commands = {
  players = {}
  admin = {
    anuncio: (message) => {
      room.sendAnnouncement(`${message}`, null, 0xEFB100, "bold")
      return false
    }
    mute: () => {
      muteSala = true
      room.sendAnnouncement(`El host ha sido muteado, un poco de silencio gordo`, null, 0xEFB100, "bold");
      return false
    }
    unmute: () => {
      muteSala = false
      room.sendAnnouncement(`El host ha sido desmuteado, ya puedes hablar gordo`, null, 0xEFB100, "bold");
      return false
    }

  }
}

room.onPlayerChat = (player, message) => {
  if (message.includes("!") && player.admin == true) {
    commands.admin.message.replace("!", '');
  }
  else if (messaje.includes(!) && player.admin == false){
    commands.players.message.replace("!",'');
  }

  if ((player.team == 1 || player.team == 2) && c && modoEstricto == true && juegoComenzado == true) {
        manejadorDePosiciones(player, message)
  }
}



function comprobarJugadores(xFutsal = "x4") {
    if (modoEstricto == true) {
        if (redPlayers.length < neededPlayers.red || bluePlayers.length < neededPlayers.blue) {
            room.stopGame()
            room.sendAnnouncement("Faltan gordos en el equipo red o blue", null, 0xFF7A65, "bold");
            ready = false;
            jugadoresCompletos = false;
        } else jugadoresCompletos = true;
        if (redPlayers.some(redPlayer => redPlayer.gamePos == undefined) && jugadoresCompletos == true) {
            room.pauseGame()
            let arr = []
            redPlayers.forEach(redPlayer => {
                if (redPlayer.gamePos != undefined) {
                    arr.push(redPlayer.gamePos)
                }
            })
            arr = positions[xFutsal].filter(item => !arr.includes(item))
            room.sendAnnouncement(`Falta: ${arr.toString()}`, null, 0xFF0000, "bold");
            ready = false
        } else ready = true;
        if (bluePlayers.some(bluePlayer => bluePlayer.gamePos == undefined) && jugadoresCompletos == true) {
            room.pauseGame()
            let arr = []
            bluePlayers.forEach(bluePlayer => {
                if (bluePlayer.gamePos != undefined) {
                    arr.push(redPlayer.gamePos)
                }
            })
            arr = positions[xFutsal].filter(item => !arr.includes(item))
            room.sendAnnouncement(`Falta: ${arr.toString()}`, null, 0x0000FF, "bold");
            ready = false
        } else ready = true;
    }
}

function manejadorDePosiciones(player, message, xFutsal) {
    if (positions[xFutsal].includes(message.replace('!', '')) && modoEstricto == true) {
        console.log("hola")
        let indexR = redPlayers.findIndex(redPlayer => redPlayer.id == player.id);
        let indexB = bluePlayers.findIndex(bluePlayer => bluePlayer.id == player.id);
        if (indexR != -1) {
            if (redPlayers.some(redPlayer => redPlayer.gamePos == message)) {
                room.sendAnnouncement("Ya hay un anon con esa posicion, atento gordo", player.id, 0xFF0000, "bold");
                return
            }
            redPlayers[indexR].gamePos = message
            room.setPlayerAvatar(player.id, message.replace('!', '').toUpperCase())
            ready = true;
        }
        else if (indexB != -1) {
            if (bluePlayers.some(bluePlayer => bluePlayer.gamePos == message)) {
                room.sendAnnouncement("Ya hay un anon con esa posicion, atento gordo", player.id, 0xFF0000, "bold");
                return
            }
            bluePlayers[indexB].gamePos = message
            room.setPlayerAvatar(player.id, message.replace('!', '').toUpperCase())
            ready = true;
        }
    }
    return false
}

function CorrectorDeEquipo(player = null) {
    if (modoEstricto == true) {
        if (redPlayers.length != neededPlayers.red - 1) {
            let indexR = redPlayers.findIndex(redPlayer => redPlayer.id == player.id);
            redPlayers.splice(indexR, 1);
            return
        }
        else if (bluePlayers.length != neededPlayers.blue - 1) {
            let indexB = bluePlayers.findIndex(bluePlayer => bluePlayer.id == player.id);
            bluePlayers.splice(indexB, 1);
            return
        }
        if (player.team == 1) {
            redPlayers.push(player)
        }
        else {
            bluePlayers.push(player)
        }
    }
}
