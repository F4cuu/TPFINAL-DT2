class Level1Scene extends Phaser.Scene {
  constructor() {
    super('Level1Scene');
  }

  init(data) {
    this.score = data.score || 0;
    this.lives = data.lives || 3;
  }

  create() {
    this.createTextures();
    this.add.rectangle(400, 300, 800, 600, 0x1a472a);

    this.timeRemaining = 60;
    this.npcsSaved = 0;
    this.npcTarget = 8;

    this.physics.world.setBounds(0, 0, 800, 600);
    this.createLayout();

    this.player = this.physics.add.sprite(240, 300, 'player');
    this.player.setDisplaySize(30, 40);
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    this.npcs = this.physics.add.group();
    // Place exactly 8 NPCs inside the corridor structure (not in the outside doors)
    const npcPositions = [
      { x: 220, y: 140 },
      { x: 220, y: 260 },
      { x: 220, y: 380 },
      { x: 220, y: 500 },
      { x: 580, y: 140 },
      { x: 580, y: 260 },
      { x: 580, y: 380 },
      { x: 580, y: 500 }
    ];

    npcPositions.forEach(pos => {
      const npc = this.physics.add.sprite(pos.x, pos.y, 'npc');
      npc.setDisplaySize(25, 35);
      npc.setBounce(0.2);
      npc.setCollideWorldBounds(true);
      npc.saved = false;
      this.npcs.add(npc);
    });

    this.falling = this.physics.add.group();

    this.hazardSpawner = this.time.addEvent({
      delay: 2000,
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

    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE
    });

    this.physics.add.collider(this.player, this.walls);
    this.physics.add.collider(this.npcs, this.walls);
    this.physics.add.collider(this.falling, this.walls, hazard => hazard.destroy());
    // prevent player from accessing the outside through door gaps by creating door zones
    // NPCs are NOT blocked by these zones so they can be pushed out
    this.doorZones = [];
    const gapYs = [120, 220, 320, 420, 520];
    gapYs.forEach(gapY => {
      // left door zone
      const lz = this.add.zone(120, gapY, 80, 60);
      this.physics.add.existing(lz, true);
      // right door zone
      const rz = this.add.zone(680, gapY, 80, 60);
      this.physics.add.existing(rz, true);
      this.doorZones.push(lz, rz);
    });
    // if the player overlaps a door zone, push them back into the corridor (no physical collision)
    this.doorZones.forEach(zone => {
      this.physics.add.overlap(this.player, zone, (player, z) => {
        // clamp player X inside corridor bounds
        const minX = 180;
        const maxX = 620;
        player.x = Phaser.Math.Clamp(player.x, minX, maxX);
        player.y = Phaser.Math.Clamp(player.y, 60, 540);
        player.setVelocity(0, 0);
      });
    });
    this.physics.add.overlap(this.safeZone, this.npcs, (zone, npc) => this.saveNpc(npc));
    // player needs two direct hits from falling objects to lose one life
    this.playerHitCount = 0;
    this.physics.add.overlap(this.player, this.falling, (player, hazard) => {
      // destroy hazard immediately on contact
      if (hazard && hazard.active) hazard.destroy();
      this.playerHitCount++;
      // reduce score slightly per hit
      this.score -= 5;
      if (this.playerHitCount >= 2) {
        this.playerHitCount = 0;
        this.lives--;
        // additional score penalty for losing a life
        this.score -= 5;
        if (this.lives <= 0) {
          this.endLevel();
        }
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

    if (Phaser.Input.Keyboard.JustDown(this.keys.space)) {
      this.pushNpc();
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
    if (!this.textures.exists('wall')) {
      const wallGraphic = this.add.graphics();
      wallGraphic.fillStyle(0x555555, 1);
      wallGraphic.fillRect(0, 0, 20, 120);
      wallGraphic.generateTexture('wall', 20, 120);
      wallGraphic.destroy();
    }
  }

  createLayout() {
    this.walls = this.physics.add.staticGroup();
    const wallX = [160, 640];
    const gaps = [120, 220, 320, 420, 520];

    wallX.forEach(x => {
      let previousY = 0;
      gaps.forEach(gapY => {
        const segmentHeight = gapY - previousY - 30;
        if (segmentHeight > 0) {
          const wall = this.walls.create(x, previousY + segmentHeight / 2, 'wall');
          wall.setDisplaySize(20, segmentHeight).refreshBody();
        }
        previousY = gapY + 30;
      });
      const bottomHeight = 600 - previousY;
      if (bottomHeight > 0) {
        const wall = this.walls.create(x, previousY + bottomHeight / 2, 'wall');
        wall.setDisplaySize(20, bottomHeight).refreshBody();
      }
    });

    this.safeZone = this.add.zone(760, 300, 80, 560);
    this.physics.add.existing(this.safeZone, true);
    this.add.rectangle(760, 300, 80, 560, 0x27ae60, 0.25);
  }

  pushNpc() {
    let nearestNpc = null;
    let nearestDistance = 80;

    this.npcs.getChildren().forEach(npc => {
      if (npc.saved) {
        return;
      }
      const distance = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        npc.x,
        npc.y
      );
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestNpc = npc;
      }
    });

    if (!nearestNpc) {
      return;
    }

    const targetX = 760;
    const directionX = Phaser.Math.Clamp(targetX - nearestNpc.x, 0, 1);
    nearestNpc.setVelocity(directionX * 320, Phaser.Math.Between(-60, 60));
  }

  saveNpc(npc) {
    if (npc.saved) {
      return;
    }

    npc.saved = true;
    npc.setAlpha(0.5);
    npc.setVelocity(0, 0);
    this.npcsSaved++;
    this.score += 10;
  }

  spawnHazard() {
    if (this.timeRemaining <= 0) return;

    const hazardTypes = ['box', 'luggage', 'person'];
    const type = Phaser.Utils.Array.GetRandom(hazardTypes);

    const x = Phaser.Math.Between(180, 620);
    const hazard = this.physics.add.sprite(x, -50, type);
    hazard.setDisplaySize(hazard.width, hazard.height);
    hazard.setVelocityY(220);
    hazard.setBounce(0.1);

    this.falling.add(hazard);

    this.time.delayedCall(3500, () => {
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
      this.scene.start('Level2Scene', {
        score: this.score,
        lives: this.lives
      });
    } else {
      this.scene.start('GameOverScene', { score: this.score });
    }
  }
}

