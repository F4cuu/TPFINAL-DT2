class BaseLevel extends Phaser.Scene {
  constructor(key) { super(key); }

  getConfig() { return {}; }
  getNpcPositions() { return []; }
  hasEnemy() { return false; }

  preload() { createGameTextures(this); }

  init(data) {
    this.score = data.score || 0;
    this.lives = data.lives !== undefined ? data.lives : 3;
  }

  create() {
    this.add.rectangle(62, 300, 124, 600, 0x0d1b2a);
    this.add.rectangle(738, 300, 124, 600, 0x0d1b2a);
    this.add.rectangle(410, 300, 570, 600, 0x1a3a2a);
    this.physics.world.setBounds(0, 0, 800, 600);

    const cfg = this.getConfig();
    this.timeRemaining = cfg.time;
    this.npcsSaved = 0;
    this.npcTarget = cfg.npcTarget;
    this.falling = this.physics.add.group();

    this.buildWallsAndSeats();
    this.buildDoors();
    this.player = this.physics.add.sprite(410, 300, 'player');
    this.player.setDisplaySize(18, 26);
    this.player.setCollideWorldBounds(true);

    if (this.hasEnemy()) {
      this.enemy = this.physics.add.sprite(410, 60, 'enemy');
      this.enemy.setDisplaySize(18, 26);
      this.enemy.setCollideWorldBounds(true);
    }
    this.invuln = false;

    this.npcs = this.physics.add.group();
    this.getNpcPositions().forEach(p => {
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

    if (this.hasEnemy()) {
      this.physics.add.collider(this.enemy, this.walls);
      this.physics.add.collider(this.enemy, this.seats);
    }

    this.physics.add.overlap(this.player, this.coins, (p, c) => { c.destroy(); this.score += 5; });

    const initSpawns = cfg.initialSpawns || 2;
    for (let i = 0; i < initSpawns; i++) this.spawnHazard();
    this.hazardSpawner = this.time.addEvent({
      delay: cfg.spawnDelay, callback: this.spawnHazard, callbackScope: this, loop: true
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
    this.player.x = Math.min(670, Math.max(130, this.player.x));

    if (Phaser.Input.Keyboard.JustDown(this.keys.space)) this.pushNpc();

    const fallingCopy = this.falling.getChildren().slice();
    fallingCopy.forEach(h => {
      if (!h.active) return;
      const dhx = this.player.x - h.x, dhy = this.player.y - h.y;
      if (Math.sqrt(dhx * dhx + dhy * dhy) < 20) {
        h.destroy();
        this.takeDamage('hazard');
      }
    });

    const npcCopy = this.npcs.getChildren().slice();
    npcCopy.forEach(npc => {
      if (!npc.saved && (npc.x < 120 || npc.x > 680)) this.saveNpc(npc);
    });

    if (this.hasEnemy()) {
      const dx = this.player.x - this.enemy.x;
      const dy = this.player.y - this.enemy.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 0) {
        this.enemy.setVelocity((dx / dist) * 130, (dy / dist) * 130);
      }
      if (dist < 20) this.takeDamage('enemy');
    }

    this.scoreText.setText(`Puntos: ${this.score}`);
    this.livesText.setText(`Vidas: ${this.lives}`);
    this.timeText.setText(`Tiempo: ${this.timeRemaining}s`);
    this.savedText.setText(`Salvados: ${this.npcsSaved}/${this.npcTarget}`);
  }

  takeDamage(source) {
    if (this.invuln || this._go) return;
    this.score -= 10; this.lives--;
    this.invuln = true; this.player.setAlpha(0.5);
    if (source === 'enemy' && this.hasEnemy()) {
      this.enemy.setPosition(410, 60);
      this.enemy.setVelocity(0, 0);
    }
    if (this.lives <= 0) { this._go = true; this.scene.start('GameOverScene', { score: this.score }); return; }
    this.time.delayedCall(500, () => { this.invuln = false; this.player.setAlpha(1); });
  }

  buildDoors() {
    [108, 204, 300, 396, 492].forEach(dy => {
      this.add.rectangle(125, dy, 14, 36, 0x4ecdc4, 0.25);
      this.add.rectangle(695, dy, 14, 36, 0x4ecdc4, 0.25);
      this.add.text(100, dy, '→', { fontSize: '16px', color: '#4ecdc4' }).setOrigin(0.5);
      this.add.text(700, dy, '←', { fontSize: '16px', color: '#4ecdc4' }).setOrigin(0.5);
    });
  }

  pushNpc() {
    let near = null, minD = 90;
    this.npcs.getChildren().forEach(n => {
      if (n.saved) return;
      const dx = this.player.x - n.x;
      const dy = this.player.y - n.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < minD) { minD = d; near = n; }
    });
    if (!near) { this.score -= 5; this.showPenalty(); return; }
    near.setVelocity(near.x < 400 ? -320 : 320, Phaser.Math.Between(-40, 40));
  }

  showPenalty() {
    const txt = this.add.text(this.player.x, this.player.y - 30, '-5', { fontSize: '18px', fontStyle: 'bold', color: '#ff4444' }).setOrigin(0.5);
    this.tweens.add({ targets: txt, y: txt.y - 30, alpha: 0, duration: 600, onComplete: () => txt.destroy() });
  }

  saveNpc(n) {
    n.saved = true; n.setAlpha(0.3); n.setVelocity(0, 0);
    this.npcsSaved++; this.score += 10;
    if (this.npcsSaved >= this.npcTarget) {
      this.hazardSpawner.remove(); this.gameTimer.remove();
      this.scene.start(this.getConfig().nextScene, { score: this.score, lives: this.lives, npcsSaved: this.npcsSaved });
    }
  }

  showWarning(x) {
    const w = this.add.text(x, 20, '!', { fontSize: '30px', fontStyle: 'bold', color: '#ff0000' }).setOrigin(0.5);
    this.tweens.add({ targets: w, alpha: 0, duration: 900, onComplete: () => w.destroy() });
  }

  spawnHazard() {
    if (this.timeRemaining <= 0) return;
    const cfg = this.getConfig();
    const type = Phaser.Utils.Array.GetRandom(['box', 'luggage', 'person']);
    const lane = Phaser.Utils.Array.GetRandom(cfg.hazardLanes);
    const spread = cfg.hazardSpread || 15;
    const x = Phaser.Math.Between(-spread, spread) + lane;
    const sz = cfg.hazardSizes;
    this.showWarning(x);
    this.time.delayedCall(800, () => {
      if (this.timeRemaining <= 0) return;
      const h = this.falling.create(x, -40, type);
      h.setDisplaySize(sz[type][0], sz[type][1]);
      h.setVelocityY(cfg.hazardSpeed);
      this.time.delayedCall(3500, () => { if (h && h.active) h.destroy(); });
    });
  }

  endLevel() {
    if (this._go) return;
    if (this.hazardSpawner) this.hazardSpawner.remove();
    if (this.gameTimer) this.gameTimer.remove();
    const next = this.getConfig().nextScene;
    if (this.npcsSaved >= this.npcTarget)
      this.scene.start(next, { score: this.score, lives: this.lives, npcsSaved: this.npcsSaved });
    else this.scene.start('GameOverScene', { score: this.score });
  }
}
