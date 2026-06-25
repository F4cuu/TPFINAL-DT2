class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOverScene'); }

  init(data) {
    this.finalScore = data.score || 0;
  }

  create() {
    this.add.rectangle(400, 300, 800, 600, 0x1a0000);
    this.add.text(400, 150, 'GAME OVER', { fontSize: '52px', fontStyle: 'bold', color: '#ff4444' }).setOrigin(0.5);
    this.add.text(400, 240, `Puntaje Final: ${this.finalScore}`, { fontSize: '24px', color: '#fff' }).setOrigin(0.5);

    const btnR = this.add.rectangle(400, 340, 220, 50, 0x4ecdc4).setInteractive({ useHandCursor: true });
    this.add.text(400, 340, 'REINTENTAR', { fontSize: '20px', fontStyle: 'bold', color: '#000' }).setOrigin(0.5);
    btnR.on('pointerover', () => btnR.setFillStyle(0x3dbdb5));
    btnR.on('pointerout', () => btnR.setFillStyle(0x4ecdc4));
    btnR.on('pointerdown', () => {
      this.scene.stop('Level1Scene');
      this.scene.start('Level1Scene', { score: 0, lives: 3 });
    });

    const btnM = this.add.rectangle(400, 420, 220, 50, 0x666666).setInteractive({ useHandCursor: true });
    this.add.text(400, 420, 'MENÚ', { fontSize: '20px', fontStyle: 'bold', color: '#fff' }).setOrigin(0.5);
    btnM.on('pointerover', () => btnM.setFillStyle(0x888888));
    btnM.on('pointerout', () => btnM.setFillStyle(0x666666));
    btnM.on('pointerdown', () => this.scene.start('MenuScene'));
  }
}
