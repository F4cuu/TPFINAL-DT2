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
    this.add.rectangle(65, 300, 130, 600, 0x0d1b2a);
    this.add.rectangle(735, 300, 130, 600, 0x0d1b2a);
    this.add.rectangle(400, 300, 540, 600, 0x1a3a2a);
    this.physics.world.setBounds(0, 0, 800, 600);

    this.timeRemaining = 60;
    this.npcsSaved = 0;
    this.npcTarget = 4;
    this.falling = this.physics.add.group();

    this.buildWalls();
    this.buildHC();
    this.createPlayer();
    this.createNPCs();
    this.createHUD();
    this.createInput();
    this.setupCollisions();

    this.spawnHazard();
    this.spawnHazard();
    this.hazardSpawner = this.time.addEvent({
      delay: 2000, callback: this.spawnHazard, callbackScope: this, loop: true
    });
    this.gameTimer = this.time.addEvent({
      delay: 1000, callback: () => {
        this.timeRemaining--;
        if (this.timeRemaining <= 0) this.endLevel();
      }, callbackScope: this, loop: true
    });
  }

  update() {
    this.player.setVelocity(0, 0);
    if (this.keys.left.isDown) this.player.setVelocityX(-200);
    if (this.keys.right.isDown) this.player.setVelocityX(200);
    if (this.keys.up.isDown) this.player.setVelocityY(-200);
    if (this.keys.down.isDown) this.player.setVelocityY(200);
    if (Phaser.Input.Keyboard.JustDown(this.keys.space)) this.pushNpc();

    this.npcs.getChildren().forEach(npc => {
      if (!npc.saved && (npc.x < 120 || npc.x > 680)) this.saveNpc(npc);
    });

    this.scoreText.setText(`Puntos: ${this.score}`);
    this.livesText.setText(`Vidas: ${this.lives}`);
    this.timeText.setText(`Tiempo: ${this.timeRemaining}s`);
    this.savedText.setText(`Salvados: ${this.npcsSaved}/${this.npcTarget}`);
  }

  createTextures() {
    if (!this.textures.exists('player')) {
      const g = this.add.graphics();
      g.fillStyle(0x4ecdc4, 1); g.fillRect(0, 0, 26, 36);
      g.generateTexture('player', 26, 36); g.destroy();
    }
    if (!this.textures.exists('npc')) {
      const g = this.add.graphics();
      g.fillStyle(0xff9800, 1); g.fillRect(0, 0, 20, 30);
      g.generateTexture('npc', 20, 30); g.destroy();
    }
    if (!this.textures.exists('box')) {
      const g = this.add.graphics();
      g.fillStyle(0x8b4513, 1); g.fillRect(0, 0, 30, 30);
      g.generateTexture('box', 30, 30); g.destroy();
    }
    if (!this.textures.exists('luggage')) {
      const g = this.add.graphics();
      g.fillStyle(0xd4a574, 1); g.fillRect(0, 0, 36, 26);
      g.generateTexture('luggage', 36, 26); g.destroy();
    }
    if (!this.textures.exists('person')) {
      const g = this.add.graphics();
      g.fillStyle(0xff69b4, 1); g.fillRect(0, 0, 20, 34);
      g.generateTexture('person', 20, 34); g.destroy();
    }
    if (!this.textures.exists('wall')) {
      const g = this.add.graphics();
      g.fillStyle(0x666666, 1); g.fillRect(0, 0, 16, 60);
      g.generateTexture('wall', 16, 60); g.destroy();
    }
  }

  buildWalls() {
    this.walls = this.physics.add.staticGroup();
    const hY = [100, 240, 380, 520];
    const gapH = 60;

    const buildSeg = (x, w) => {
      let prevY = 0;
      hY.forEach(dy => {
        const h = dy - gapH / 2 - prevY;
        if (h > 0) {
          const s = this.walls.create(x, prevY + h / 2, 'wall');
          s.setDisplaySize(w, h).refreshBody();
        }
        prevY = dy + gapH / 2;
      });
      if (600 - prevY > 0) {
        const s = this.walls.create(x, prevY + (600 - prevY) / 2, 'wall');
        s.setDisplaySize(w, 600 - prevY).refreshBody();
      }
    };

    buildSeg(130, 16);
    buildSeg(670, 16);
    buildSeg(250, 10);
    buildSeg(350, 10);
    buildSeg(450, 10);
    buildSeg(550, 10);
  }

  buildHC() {
    [100, 240, 380, 520].forEach(dy => {
      this.add.rectangle(130, dy, 14, 48, 0x4ecdc4, 0.3);
      this.add.rectangle(670, dy, 14, 48, 0x4ecdc4, 0.3);
      this.add.text(105, dy, '←', { fontSize: '16px', color: '#4ecdc4' }).setOrigin(0.5);
      this.add.text(695, dy, '→', { fontSize: '16px', color: '#4ecdc4' }).setOrigin(0.5);
    });
  }

  createPlayer() {
    this.player = this.physics.add.sprite(400, 240, 'player');
    this.player.setDisplaySize(26, 36);
    this.player.setCollideWorldBounds(true);
  }

  createNPCs() {
    this.npcs = this.physics.add.group();
    const positions = [
      { x: 190, y: 100 }, { x: 610, y: 100 },
      { x: 190, y: 380 }, { x: 610, y: 380 },
    ];
    positions.forEach(pos => {
      const npc = this.physics.add.sprite(pos.x, pos.y, 'npc');
      npc.setDisplaySize(20, 30);
      npc.setCollideWorldBounds(true);
      npc.saved = false;
      this.npcs.add(npc);
    });
  }

  createHUD() {
    this.scoreText = this.add.text(10, 10, `Puntos: ${this.score}`, { fontSize: '16px', color: '#ffffff' });
    this.livesText = this.add.text(10, 35, `Vidas: ${this.lives}`, { fontSize: '16px', color: '#ff6b6b' });
    this.timeText = this.add.text(10, 60, `Tiempo: ${this.timeRemaining}s`, { fontSize: '16px', color: '#ffeb3b' });
    this.savedText = this.add.text(10, 85, `Salvados: ${this.npcsSaved}/${this.npcTarget}`, { fontSize: '16px', color: '#4ecdc4' });
  }

  createInput() {
    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE
    });
  }

  setupCollisions() {
    this.physics.add.collider(this.player, this.walls);
    this.physics.add.collider(this.npcs, this.walls);
    this.physics.add.collider(this.falling, this.walls, h => h.destroy());

    this.physics.add.overlap(this.player, this.falling, (p, h) => {
      if (h && h.active) h.destroy();
      this.score -= 5;
      this.lives--;
      if (this.lives <= 0) this.endLevel();
    });
  }

  pushNpc() {
    let nearest = null;
    let minDist = 90;
    this.npcs.getChildren().forEach(npc => {
      if (npc.saved) return;
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y);
      if (d < minDist) { minDist = d; nearest = npc; }
    });
    if (!nearest) return;

    const dir = nearest.x < 400 ? -1 : 1;
    nearest.setVelocity(dir * 320, Phaser.Math.Between(-40, 40));
  }

  saveNpc(npc) {
    npc.saved = true;
    npc.setAlpha(0.3);
    npc.setVelocity(0, 0);
    this.npcsSaved++;
    this.score += 10;
    if (this.npcsSaved >= this.npcTarget) {
      this.hazardSpawner.remove();
      this.gameTimer.remove();
      this.scene.start('VictoryScene', { score: this.score, lives: this.lives, npcsSaved: this.npcsSaved });
    }
  }

  spawnHazard() {
    if (this.timeRemaining <= 0) return;
    const types = ['box', 'luggage', 'person'];
    const type = Phaser.Utils.Array.GetRandom(types);
    const sizes = { box: 30, luggage: 36, person: 20 };
    const heights = { box: 30, luggage: 26, person: 34 };
    const lanes = [300, 500];
    const x = Phaser.Math.Between(-15, 15) + Phaser.Utils.Array.GetRandom(lanes);
    const hazard = this.falling.create(x, -40, type);
    hazard.setDisplaySize(sizes[type], heights[type]);
    hazard.setVelocityY(200);
    this.time.delayedCall(3500, () => {
      if (hazard && hazard.active) hazard.destroy();
    });
  }

  endLevel() {
    if (this.hazardSpawner) this.hazardSpawner.remove();
    if (this.gameTimer) this.gameTimer.remove();
    if (this.npcsSaved >= this.npcTarget) {
      this.scene.start('VictoryScene', { score: this.score, lives: this.lives, npcsSaved: this.npcsSaved });
    } else {
      this.scene.start('GameOverScene', { score: this.score });
    }
  }
}
