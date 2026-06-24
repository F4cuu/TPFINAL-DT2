class VictoryScene extends Phaser.Scene {
  constructor() { super('VictoryScene'); }

  init(data) {
    this.finalScore = data.score || 0;
    this.npcsSaved = data.npcsSaved || 0;
  }

  create() {
    this.add.rectangle(400, 300, 800, 600, 0x0a2a0a);
    this.add.text(400, 120, '¡VICTORIA!', { fontSize: '48px', fontStyle: 'bold', color: '#4ecdc4' }).setOrigin(0.5);
    this.add.text(400, 200, '¡Salvaste a todos los pasajeros!', { fontSize: '20px', color: '#fff' }).setOrigin(0.5);
    this.add.text(400, 250, `Pasajeros salvados: ${this.npcsSaved}`, { fontSize: '22px', color: '#4ecdc4' }).setOrigin(0.5);
    this.add.text(400, 290, `Puntaje Final: ${this.finalScore}`, { fontSize: '22px', color: '#ffd700' }).setOrigin(0.5);

    const btn = this.add.rectangle(400, 380, 220, 50, 0x4ecdc4).setInteractive({ useHandCursor: true });
    this.add.text(400, 380, 'VOLVER AL MENÚ', { fontSize: '20px', fontStyle: 'bold', color: '#000' }).setOrigin(0.5);
    btn.on('pointerover', () => btn.setFillStyle(0x3dbdb5));
    btn.on('pointerout', () => btn.setFillStyle(0x4ecdc4));
    btn.on('pointerdown', () => this.scene.start('MenuScene'));
  }
}
