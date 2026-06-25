class Level2Scene extends BaseLevel {
  constructor() { super('Level2Scene'); }

  getConfig() {
    return {
      time: 50, npcTarget: 5, spawnDelay: 1500, hazardSpeed: 250,
      hazardLanes: [293, 525],
      hazardSizes: { box: [26, 26], luggage: [28, 20], person: [16, 26] }, hazardSpread: 3,
      nextScene: 'Level3Scene'
    };
  }

  getNpcPositions() {
    return [[180, 108], [180, 300], [180, 492], [630, 204], [630, 396]];
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

  createCoins() {
    this.coins = this.physics.add.staticGroup();
    [[180, 108], [293, 108], [525, 108],
      [180, 204], [410, 204], [630, 204],
      [293, 300], [410, 300], [525, 300],
      [180, 396], [410, 396], [630, 396],
      [293, 492], [525, 492], [630, 492],
      [293, 60], [525, 156], [293, 348]].forEach(p => {
      const c = this.coins.create(p[0], p[1], 'coin');
      c.setDisplaySize(12, 12);
    });
  }
}
