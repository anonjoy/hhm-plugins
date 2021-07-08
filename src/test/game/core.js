
var room = HBInit();

room.pluginSpec = {
  name: `...`, // Current Map Original Disc Properties
};

class Game {
  constructor(){
    let GAME_STATE;
    let PREVIOUS_GAME_STATE;
    this.getGameState = () => GAME_STATE;
    this.setGameState = function(NEW_STATE){
      GAME_STATE = NEW_STATE;
    }
  }
}

const GM = new Game();
const getGameObject = () => GM;
