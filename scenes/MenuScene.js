class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    this.add.rectangle(400, 300, 800, 600, 0x1a1a2e);

    this.add.text(400, 120, 'PARACHUTE PUSH', {
      fontSize: '48px',
      fontStyle: 'bold',
      color: '#4ecdc4',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.add.text(400, 180, '"Está mal, pero no tan mal"', {
      fontSize: '18px',
      fontStyle: 'italic',
      color: '#a0a0a0',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.add.text(400, 250, 'Empujá a los tripulantes fuera de la zona\nde peligro antes de que caigan objetos.', {
      fontSize: '16px',
      color: '#cccccc',
      fontFamily: 'Arial',
      align: 'center'
    }).setOrigin(0.5);

    const playBtn = this.add.rectangle(400, 400, 220, 60, 0x4ecdc4);
    this.add.text(400, 400, 'JUGAR', {
      fontSize: '26px',
      fontStyle: 'bold',
      color: '#1a1a2e',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    playBtn.setInteractive({ useHandCursor: true });
    playBtn.on('pointerover', () => playBtn.setFillStyle(0x45b9ad));
    playBtn.on('pointerout', () => playBtn.setFillStyle(0x4ecdc4));
    playBtn.on('pointerdown', () => {
      this.scene.start('Level1Scene', { score: 0, lives: 3 });
    });

    this.add.text(400, 560, 'Parachute Push © 2026', {
      fontSize: '12px',
      color: '#555555',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
  }
}
