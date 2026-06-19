class VictoryScene extends Phaser.Scene {
  constructor() {
    super('VictoryScene');
  }

  init(data) {
    this.score = data.score || 0;
    this.lives = data.lives || 0;
    this.npcsSaved = data.npcsSaved || 0;
  }

  create() {
    this.add.rectangle(400, 300, 800, 600, 0x1a2e1a);

    this.add.text(400, 100, '¡VICTORIA!', {
      fontSize: '48px',
      fontStyle: 'bold',
      color: '#00ff00',
      align: 'center'
    }).setOrigin(0.5);

    this.add.text(400, 180, 'Has salvado a todos los tripulantes', {
      fontSize: '18px',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);

    this.add.text(400, 240, `Puntos: ${this.score}`, {
      fontSize: '28px',
      color: '#ffeb3b',
      align: 'center'
    }).setOrigin(0.5);

    this.add.text(400, 290, `Tripulantes salvados: ${this.npcsSaved}`, {
      fontSize: '20px',
      color: '#4ecdc4',
      align: 'center'
    }).setOrigin(0.5);

    this.add.text(400, 340, `Vidas restantes: ${this.lives}`, {
      fontSize: '20px',
      color: '#4ecdc4',
      align: 'center'
    }).setOrigin(0.5);

    const nextButton = this.add.rectangle(200, 380, 150, 50, 0x4ecdc4);
    nextButton.setInteractive({ useHandCursor: true });
    nextButton.on('pointerover', () => nextButton.setFillStyle(0x45b9ad));
    nextButton.on('pointerout', () => nextButton.setFillStyle(0x4ecdc4));
    nextButton.on('pointerdown', () => {
      this.scene.start('Level2Scene', {
        score: this.score,
        lives: this.lives
      });
    });

    this.add.text(200, 380, 'Siguiente', {
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);

    const menuButton = this.add.rectangle(400, 380, 150, 50, 0xff9800);
    menuButton.setInteractive({ useHandCursor: true });
    menuButton.on('pointerover', () => menuButton.setFillStyle(0xe68900));
    menuButton.on('pointerout', () => menuButton.setFillStyle(0xff9800));
    menuButton.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });

    this.add.text(400, 380, 'Menú', {
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);

    const restartButton = this.add.rectangle(600, 380, 150, 50, 0xff6b6b);
    restartButton.setInteractive({ useHandCursor: true });
    restartButton.on('pointerover', () => restartButton.setFillStyle(0xff5252));
    restartButton.on('pointerout', () => restartButton.setFillStyle(0xff6b6b));
    restartButton.on('pointerdown', () => {
      this.scene.start('Level1Scene');
    });

    this.add.text(600, 380, 'Reiniciar', {
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);
  }
}
