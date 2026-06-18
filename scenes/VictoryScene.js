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

    const menuButton = this.add.rectangle(400, 420, 200, 60, 0x4ecdc4);
    menuButton.setInteractive({ useHandCursor: true });
    menuButton.on('pointerover', () => {
      menuButton.setFillStyle(0x45b9ad);
    });
    menuButton.on('pointerout', () => {
      menuButton.setFillStyle(0x4ecdc4);
    });
    menuButton.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });

    this.add.text(400, 420, 'MENÚ', {
      fontSize: '24px',
      fontStyle: 'bold',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);
  }
}
