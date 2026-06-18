class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    this.add.rectangle(400, 300, 800, 600, 0x1a1a2e);

    this.add.text(400, 100, 'PARACHUTE PUSH', {
      fontSize: '48px',
      fontStyle: 'bold',
      color: '#ff6b6b',
      align: 'center'
    }).setOrigin(0.5);

    this.add.text(400, 200, 'Salva a los tripulantes', {
      fontSize: '20px',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);

    this.add.text(400, 240, 'Tienes 60 segundos', {
      fontSize: '16px',
      color: '#aaaaaa',
      align: 'center'
    }).setOrigin(0.5);

    const playButton = this.add.rectangle(400, 380, 200, 60, 0x4ecdc4);
    playButton.setInteractive({ useHandCursor: true });
    playButton.on('pointerover', () => {
      playButton.setFillStyle(0x45b9ad);
    });
    playButton.on('pointerout', () => {
      playButton.setFillStyle(0x4ecdc4);
    });
    playButton.on('pointerdown', () => {
      this.scene.start('Level1Scene', { score: 0, lives: 3 });
    });

    this.add.text(400, 380, 'JUGAR', {
      fontSize: '24px',
      fontStyle: 'bold',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);
  }
}

