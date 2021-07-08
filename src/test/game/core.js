
var room = HBInit();

room.pluginSpec = {
  name: `...`,
};

class Game {
  constructor(){
    let GAME_STATE = 0;
    let PREVIOUS_GAME_STATE;
    let ORIGINAL_BALL_PROPERTIES;
    let ORIGINAL_PLAYER_DISC_PROPERTIES = {};
    this.getGameState                     = () => GAME_STATE;
    this.getPreviousGameState             = () => PREVIOUS_GAME_STATE;
    this.getOriginalBallProperties        = () => ORIGINAL_BALL_PROPERTIES;
    this.getOriginalPlayerDiscProperties  = (TEAM) => ORIGINAL_PLAYER_DISC_PROPERTIES[TEAM];
    this.setGameState = function(NEW_STATE){
      PREVIOUS_GAME_STATE = GAME_STATE;
      GAME_STATE = NEW_STATE;
    }
    this.setOriginalBallProperties = function(BALL_PROPERTIES){
      ORIGINAL_BALL_PROPERTIES = BALL_PROPERTIES;
    }
    this.setOriginalPlayerDiscProperties = function(TEAM, PLAYER_DISC_PROPERTIES){
      ORIGINAL_PLAYER_DISC_PROPERTIES[TEAM] = PLAYER_DISC_PROPERTIES;
    }
  }
}

const GM = new Game();
const getGameObject = () => GM;
