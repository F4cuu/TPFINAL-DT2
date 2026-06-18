class Level3Scene extends Phaser.Scene {
  constructor() {
    super('Level3Scene');
  }

  init(data) {
    this.score = data.score || 0;
    this.lives = data.lives || 3;
  }

  create() {
    this.createTextures();
    this.add.rectangle(400, 300, 800, 600, 0x2a1a1a);

    this.timeRemaining = 60;
    this.npcsSaved = 0;
    this.npcTarget = 15;

    this.physics.world.setBounds(0, 0, 800, 600);

    this.player = this.physics.add.sprite(50, 300, 'player');
    this.player.setDisplaySize(30, 40);
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    this.npcs = this.physics.add.group();
    for (let i = 0; i < 25; i++) {
      const x = Phaser.Math.Between(150, 750);
      const y = Phaser.Math.Between(100, 500);
      const npc = this.physics.add.sprite(x, y, 'npc');
      npc.setDisplaySize(25, 35);
      npc.setBounce(0.3);
      npc.setCollideWorldBounds(true);
      npc.saved = false;
      this.npcs.add(npc);
    }

    this.falling = this.physics.add.group();

    this.dangerousNPC = this.physics.add.sprite(650, 300, 'dangerous');
    this.dangerousNPC.setDisplaySize(35, 45);
    this.dangerousNPC.setBounce(0.5);
    this.dangerousNPC.setCollideWorldBounds(true);
    this.dangerousNPC.isDangerous = true;

    this.hazardSpawner = this.time.addEvent({
      delay: 1000,
      callback: this.spawnHazard,
      callbackScope: this,
      loop: true
    });

    this.gameTimer = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.timeRemaining--;
        if (this.timeRemaining <= 0) {
          this.endLevel();
        }
      },
      callbackScope: this,
      loop: true
    });

    this.scoreText = this.add.text(20, 20, `Puntos: ${this.score}`, {
      fontSize: '18px',
      color: '#ffffff'
    });

    this.livesText = this.add.text(20, 50, `Vidas: ${this.lives}`, {
      fontSize: '18px',
      color: '#ff6b6b'
    });

    this.timeText = this.add.text(20, 80, `Tiempo: ${this.timeRemaining}s`, {
      fontSize: '18px',
      color: '#ffeb3b'
    });

    this.savedText = this.add.text(20, 110, `Salvados: ${this.npcsSaved} / ${this.npcTarget}`, {
      fontSize: '18px',
      color: '#4ecdc4'
    });

    this.levelText = this.add.text(400, 20, 'NIVEL 3 - FINAL', {
      fontSize: '24px',
      fontStyle: 'bold',
      color: '#d32f2f',
      align: 'center'
    }).setOrigin(0.5);

    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE
    });

    this.physics.add.overlap(this.player, this.falling, (player, hazard) => {
      this.lives--;
      this.score -= 10;
      hazard.destroy();
      if (this.lives <= 0) {
        this.endLevel();
      }
    });

    this.physics.add.overlap(this.player, this.dangerousNPC, () => {
      this.lives--;
      this.score -= 15;
      if (this.lives <= 0) {
        this.endLevel();
      }
    });

    this.physics.add.overlap(this.npcs, this.falling, (npc, hazard) => {
      if (!npc.saved) {
        npc.saved = true;
        npc.setAlpha(0.5);
        hazard.destroy();
      }
    });
  }

  update() {
    this.player.setVelocity(0, 0);

    if (this.keys.left.isDown) {
      this.player.setVelocityX(-200);
    }
    if (this.keys.right.isDown) {
      this.player.setVelocityX(200);
    }
    if (this.keys.up.isDown) {
      this.player.setVelocityY(-200);
    }
    if (this.keys.down.isDown) {
      this.player.setVelocityY(200);
    }

    const dangerAngle = Phaser.Math.Angle.Between(
      this.dangerousNPC.x,
      this.dangerousNPC.y,
      this.player.x,
      this.player.y
    );
    this.dangerousNPC.setVelocity(
      Math.cos(dangerAngle) * 150,
      Math.sin(dangerAngle) * 150
    );

    if (Phaser.Input.Keyboard.JustDown(this.keys.space)) {
      this.npcs.getChildren().forEach(npc => {
        const distance = Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          npc.x,
          npc.y
        );

        if (distance < 80 && !npc.saved) {
          npc.setVelocityX(Phaser.Math.Between(-400, 400));
          npc.setVelocityY(Phaser.Math.Between(-300, 100));

          if (npc.x > 700) {
            npc.saved = true;
            npc.setAlpha(0.5);
            this.npcsSaved++;
            this.score += 10;
          }
        }
      });
    }

    this.scoreText.setText(`Puntos: ${this.score}`);
    this.livesText.setText(`Vidas: ${this.lives}`);
    this.timeText.setText(`Tiempo: ${this.timeRemaining}s`);
    this.savedText.setText(`Salvados: ${this.npcsSaved} / ${this.npcTarget}`);
  }

  createTextures() {
    if (!this.textures.exists('player')) {
      const playerGraphic = this.add.graphics();
      playerGraphic.fillStyle(0x4ecdc4, 1);
      playerGraphic.fillRect(0, 0, 30, 40);
      playerGraphic.generateTexture('player', 30, 40);
      playerGraphic.destroy();
    }
    if (!this.textures.exists('npc')) {
      const npcGraphic = this.add.graphics();
      npcGraphic.fillStyle(0xff9800, 1);
      npcGraphic.fillRect(0, 0, 25, 35);
      npcGraphic.generateTexture('npc', 25, 35);
      npcGraphic.destroy();
    }
    if (!this.textures.exists('dangerous')) {
      const dangerGraphic = this.add.graphics();
      dangerGraphic.fillStyle(0xd32f2f, 1);
      dangerGraphic.fillRect(0, 0, 35, 45);
      dangerGraphic.generateTexture('dangerous', 35, 45);
      dangerGraphic.destroy();
    }
    if (!this.textures.exists('box')) {
      const boxGraphic = this.add.graphics();
      boxGraphic.fillStyle(0x8b4513, 1);
      boxGraphic.fillRect(0, 0, 40, 40);
      boxGraphic.generateTexture('box', 40, 40);
      boxGraphic.destroy();
    }
    if (!this.textures.exists('luggage')) {
      const luggageGraphic = this.add.graphics();
      luggageGraphic.fillStyle(0xd4a574, 1);
      luggageGraphic.fillRect(0, 0, 45, 35);
      luggageGraphic.generateTexture('luggage', 45, 35);
      luggageGraphic.destroy();
    }
    if (!this.textures.exists('person')) {
      const personGraphic = this.add.graphics();
      personGraphic.fillStyle(0xff69b4, 1);
      personGraphic.fillRect(0, 0, 25, 40);
      personGraphic.generateTexture('person', 25, 40);
      personGraphic.destroy();
    }
  }

  spawnHazard() {
    if (this.timeRemaining <= 0) return;

    const hazardTypes = ['box', 'luggage', 'person'];
    const type = Phaser.Utils.Array.GetRandom(hazardTypes);

    const x = Phaser.Math.Between(100, 700);
    const hazard = this.physics.add.sprite(x, -50, type);
    hazard.setDisplaySize(hazard.width, hazard.height);
    hazard.setVelocityY(350);
    hazard.setBounce(0.1);

    this.falling.add(hazard);

    this.time.delayedCall(2500, () => {
      if (hazard && hazard.active) {
        hazard.destroy();
      }
    });
  }

  endLevel() {
    if (this.hazardSpawner) {
      this.hazardSpawner.remove();
    }
    if (this.gameTimer) {
      this.gameTimer.remove();
    }

    if (this.npcsSaved >= this.npcTarget) {
      this.scene.start('VictoryScene', {
        score: this.score,
        lives: this.lives,
        npcsSaved: this.npcsSaved
      });
    } else {
      this.scene.start('GameOverScene', { score: this.score });
    }
  }
}
