const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game',
  backgroundColor: '#2d2d2d',
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  scene: [
    MenuScene,
    Level1Scene,
    Level2Scene,
    Level3Scene,
    GameOverScene,
    VictoryScene
  ]
};
let game;
window.addEventListener('load', function() {
  game = new Phaser.Game(config);
});
