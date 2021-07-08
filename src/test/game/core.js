
var room = HBInit();

room.pluginSpec = {
  name: `...`,
};

class Game {
  constructor(){
    let STATE = 0;
    let PREVIOUS_STATE;
    let ORIGINAL_BALL_PROPERTIES;
    let ORIGINAL_PLAYER_DISC_PROPERTIES = {};
    this.getState                         = () => STATE;
    this.getPreviousState                 = () => PREVIOUS_STATE;
    this.getOriginalBallProperties        = () => ORIGINAL_BALL_PROPERTIES;
    this.getOriginalPlayerDiscProperties  = (TEAM) => ORIGINAL_PLAYER_DISC_PROPERTIES[TEAM];
    this.setState = function(NEW_STATE){
      PREVIOUS_STATE = STATE;
      STATE = NEW_STATE;
    }
    this.setOriginalBallProperties = function(BALL_PROPERTIES){
      ORIGINAL_BALL_PROPERTIES = BALL_PROPERTIES;
    }
    this.setOriginalPlayerDiscProperties = function(TEAM, PLAYER_DISC_PROPERTIES){
      ORIGINAL_PLAYER_DISC_PROPERTIES[TEAM] = PLAYER_DISC_PROPERTIES;
    }
  }
}

const GAME = new Game();
const getGameObject = () => GAME;
