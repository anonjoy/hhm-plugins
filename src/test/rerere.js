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




let mapax5 = new Mapa(5, 'Futsal x5');
// console.log(mapax5.posBlue1);

// room.onStadiumChange = (newStadiumName, byPlayer) => {
//     if (newStadiumName.includes("Futsal x2")) {
//         neededPlayers.red = 2;
//         neededPlayers.blue = 2;
//         futsalMapX = "x2"
//     }
//     else if (newStadiumName.includes("Futsal x3")) {
//         neededPlayers.red = 3;
//         neededPlayers.blue = 3;
//         futsalMapX = "x3"
//     }
//     else if (newStadiumName.includes("Futsal x4")) {
//         neededPlayers.red = 4;
//         neededPlayers.blue = 4;
//         futsalMapX = "x4"
//     }
//     else if (newStadiumName.includes("Futsal x5")) {
//         neededPlayers.red = 5;
//         neededPlayers.blue = 5;
//         futsalMapX = "x5"
//     }
//     else if (newStadiumName.includes("Futsal x6")) {
//         neededPlayers.red = 6;
//         neededPlayers.blue = 6;
//         futsalMapX = "x6"
//     }
//     else if (newStadiumName.includes("Futsal x7")) {
//         neededPlayers.red = 7;
//         neededPlayers.blue = 7;
//         futsalMapX = "x7"
//     }
// }

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
