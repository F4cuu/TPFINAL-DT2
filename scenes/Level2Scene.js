class Level2Scene extends Phaser.Scene {
  constructor() { super('Level2Scene'); }

  init(data) {
    this.score = data.score || 0;
    this.lives = data.lives !== undefined ? data.lives : 3;
  }

  create() {
    createGameTextures(this);
    this.add.rectangle(62, 300, 124, 600, 0x0d1b2a);
    this.add.rectangle(738, 300, 124, 600, 0x0d1b2a);
    this.add.rectangle(410, 300, 570, 600, 0x1a3a2a);
    this.physics.world.setBounds(0, 0, 800, 600);

    this.timeRemaining = 50;
    this.npcsSaved = 0;
    this.npcTarget = 5;
    this.falling = this.physics.add.group();

    this.buildWallsAndSeats();
    this.buildDoors();
    this.player = this.physics.add.sprite(410, 300, 'player'); this.player.setDisplaySize(18, 26); this.player.setCollideWorldBounds(true);
    this.npcs = this.physics.add.group();
    [[180, 108], [180, 300], [180, 492], [630, 204], [630, 396]].forEach(p => {
      const n = this.physics.add.sprite(p[0], p[1], 'npc');
      n.setDisplaySize(16, 24); n.setCollideWorldBounds(true); n.saved = false;
      this.npcs.add(n);
    });
    this.createCoins();
    this.scoreText = this.add.text(10, 10, `Puntos: ${this.score}`, { fontSize: '16px', color: '#fff' });
    this.livesText = this.add.text(10, 35, `Vidas: ${this.lives}`, { fontSize: '16px', color: '#ff6b6b' });
    this.timeText = this.add.text(10, 60, `Tiempo: ${this.timeRemaining}s`, { fontSize: '16px', color: '#ffeb3b' });
    this.savedText = this.add.text(10, 85, `Salvados: ${this.npcsSaved}/${this.npcTarget}`, { fontSize: '16px', color: '#4ecdc4' });
    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP, down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT, right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE
    });

    this.physics.add.collider(this.player, this.walls);
    this.physics.add.collider(this.player, this.seats);
    this.physics.add.collider(this.npcs, this.walls);
    this.physics.add.collider(this.npcs, this.seats);
    this.physics.add.collider(this.falling, this.walls, h => h.destroy());
    this.physics.add.collider(this.falling, this.seats, h => h.destroy());
    this.physics.add.overlap(this.player, this.falling, (p, h) => {
      if (h && h.active) h.destroy();
      this.score -= 5; this.lives--;
      if (this.lives <= 0 && !this._go) { this._go = true; this.scene.start('GameOverScene', { score: this.score }); }
    });
    this.physics.add.overlap(this.player, this.coins, (p, c) => { c.destroy(); this.score += 5; });

    this.spawnHazard(); this.spawnHazard();
    this.hazardSpawner = this.time.addEvent({
      delay: 1500, callback: this.spawnHazard, callbackScope: this, loop: true
    });
    this.gameTimer = this.time.addEvent({
      delay: 1000, callback: () => {
        this.timeRemaining--; if (this.timeRemaining <= 0) this.endLevel();
      }, callbackScope: this, loop: true
    });
  }

  update() {
    this.player.setVelocity(0, 0);
    if (this.keys.left.isDown) this.player.setVelocityX(-200);
    if (this.keys.right.isDown) this.player.setVelocityX(200);
    if (this.keys.up.isDown) this.player.setVelocityY(-200);
    if (this.keys.down.isDown) this.player.setVelocityY(200);
    this.player.x = Phaser.Math.Clamp(this.player.x, 130, 670);
    if (Phaser.Input.Keyboard.JustDown(this.keys.space)) this.pushNpc();
    this.npcs.getChildren().forEach(npc => {
      if (!npc.saved && (npc.x < 120 || npc.x > 680)) this.saveNpc(npc);
    });
    this.scoreText.setText(`Puntos: ${this.score}`);
    this.livesText.setText(`Vidas: ${this.lives}`);
    this.timeText.setText(`Tiempo: ${this.timeRemaining}s`);
    this.savedText.setText(`Salvados: ${this.npcsSaved}/${this.npcTarget}`);
  }

  buildWallsAndSeats() {
    this.walls = this.physics.add.staticGroup();
    const wX = [125, 695], dY = [108, 204, 300, 396, 492], gH = 36;
    wX.forEach(x => {
      let p = 0;
      dY.forEach(dy => {
        const h = dy - gH / 2 - p;
        if (h > 0) { const w = this.walls.create(x, p + h / 2, 'wall'); w.setDisplaySize(14, h).refreshBody(); }
        p = dy + gH / 2;
      });
      if (600 - p > 0) { const w = this.walls.create(x, p + (600 - p) / 2, 'wall'); w.setDisplaySize(14, 600 - p).refreshBody(); }
    });
    this.seats = this.physics.add.staticGroup();
    [[200, 150], [409, 196], [619, 152]].forEach(([c, w]) => {
      [[60,60],[156,60],[252,60],[348,60],[444,60],[540,60]].forEach(([y, h]) => {
        const s = this.add.rectangle(c, y, w, h, 0x555555);
        this.physics.add.existing(s, true); this.seats.add(s);
      });
    });
  }

  buildDoors() {
    [108, 204, 300, 396, 492].forEach(dy => {
      this.add.rectangle(125, dy, 14, 36, 0x4ecdc4, 0.25);
      this.add.rectangle(695, dy, 14, 36, 0x4ecdc4, 0.25);
      this.add.text(100, dy, '→', { fontSize: '16px', color: '#4ecdc4' }).setOrigin(0.5);
      this.add.text(700, dy, '←', { fontSize: '16px', color: '#4ecdc4' }).setOrigin(0.5);
    });
  }

  createCoins() {
    this.coins = this.physics.add.staticGroup();
    [[293, 108], [525, 108], [293, 204], [525, 204],
      [293, 300], [525, 300], [293, 396], [525, 396],
      [293, 60], [525, 60], [293, 156], [525, 156],
      [293, 252], [525, 252], [293, 348], [525, 348],
      [293, 444], [525, 444]].forEach(p => {
      const c = this.coins.create(p[0], p[1], 'coin');
      c.setDisplaySize(12, 12);
    });
  }

  pushNpc() {
    let near = null, minD = 90;
    this.npcs.getChildren().forEach(n => {
      if (n.saved) return;
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, n.x, n.y);
      if (d < minD) { minD = d; near = n; }
    });
    if (!near) return;
    near.setVelocity(near.x < 400 ? -320 : 320, Phaser.Math.Between(-40, 40));
  }

  saveNpc(n) {
    n.saved = true; n.setAlpha(0.3); n.setVelocity(0, 0);
    this.npcsSaved++; this.score += 10;
    if (this.npcsSaved >= this.npcTarget) {
      this.hazardSpawner.remove(); this.gameTimer.remove();
      this.scene.start('Level3Scene', { score: this.score, lives: this.lives });
    }
  }

  showWarning(x) {
    const w = this.add.text(x, 20, '!', { fontSize: '30px', fontStyle: 'bold', color: '#ff0000' }).setOrigin(0.5);
    this.tweens.add({ targets: w, alpha: 0, duration: 900, onComplete: () => w.destroy() });
  }

  spawnHazard() {
    if (this.timeRemaining <= 0) return;
    const type = Phaser.Utils.Array.GetRandom(['box', 'luggage', 'person']);
    const lane = Phaser.Utils.Array.GetRandom([293, 525]);
    const x = Phaser.Math.Between(-4, 4) + lane;
    const sz = { box: [30, 30], luggage: [36, 26], person: [20, 34] };
    this.showWarning(x);
    this.time.delayedCall(800, () => {
      if (this.timeRemaining <= 0) return;
      const h = this.falling.create(x, -40, type);
      h.setDisplaySize(sz[type][0], sz[type][1]);
      h.setVelocityY(250);
      this.time.delayedCall(3200, () => { if (h && h.active) h.destroy(); });
    });
  }

  endLevel() {
    if (this._go) return;
    if (this.hazardSpawner) this.hazardSpawner.remove();
    if (this.gameTimer) this.gameTimer.remove();
    if (this.npcsSaved >= this.npcTarget)
      this.scene.start('Level3Scene', { score: this.score, lives: this.lives });
    else this.scene.start('GameOverScene', { score: this.score });
  }
}
