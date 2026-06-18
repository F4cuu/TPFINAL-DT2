class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  init(data) {
    this.score = data.score || 0;
  }

  preload() {
    // load user-provided image
    this.load.image('gameover', 'assets/images/descarga.jpg');
  }

  create() {
    this.cameras.main.setBackgroundColor(0x1a1a2e);

    // Title
    const title = this.add.text(400, 70, 'DERROTA', {
      fontSize: '56px',
      fontStyle: 'bold',
      color: '#ff6b6b',
      align: 'center'
    }).setOrigin(0.5).setAlpha(0);

    // image
    let img;
    try {
      img = this.add.image(400, 260, 'gameover');
      img.setOrigin(0.5);
      const maxW = 600;
      const maxH = 300;
      const scale = Math.min(maxW / img.width, maxH / img.height, 1);
      img.setScale(scale);
      img.setAlpha(0);
    } catch (e) {
      // fallback: simple rectangle if image failed to load
      img = this.add.rectangle(400, 260, 500, 250, 0x222222).setAlpha(0);
    }

    const scoreText = this.add.text(400, 420, `Puntos: ${this.score}`, {
      fontSize: '28px',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5).setAlpha(0);

    const menuButton = this.add.rectangle(400, 500, 200, 60, 0x4ecdc4).setAlpha(0);
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

    const menuText = this.add.text(400, 500, 'MENÚ', {
      fontSize: '24px',
      fontStyle: 'bold',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5).setAlpha(0);

    // simple fade-in sequence
    this.tweens.add({ targets: [title], alpha: 1, duration: 300, delay: 100 });
    this.tweens.add({ targets: [img], alpha: 1, duration: 400, delay: 300 });
    this.tweens.add({ targets: [scoreText], alpha: 1, duration: 300, delay: 800 });
    this.tweens.add({ targets: [menuButton, menuText], alpha: 1, duration: 300, delay: 1000 });
  }
}
