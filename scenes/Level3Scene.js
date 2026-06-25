class Level3Scene extends BaseLevel {
  constructor() { super('Level3Scene'); }

  getConfig() {
    return {
      time: 40, npcTarget: 6, spawnDelay: 1000, hazardSpeed: 300,
      hazardLanes: [165, 410, 655], initialSpawns: 3,
      hazardSizes: { box: [30, 30], luggage: [36, 26], person: [20, 34] },
      nextScene: 'VictoryScene'
    };
  }

  getNpcPositions() {
    return [[165, 108], [165, 300], [165, 492], [655, 108], [655, 300], [655, 492]];
  }

  hasEnemy() { return true; }

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
    [[285, 160], [535, 160]].forEach(([c, w]) => {
      [[60,60],[156,60],[252,60],[348,60],[444,60],[540,60]].forEach(([y, h]) => {
        const s = this.add.rectangle(c, y, w, h, 0x555555);
        this.physics.add.existing(s, true); this.seats.add(s);
      });
    });
  }

  createCoins() {
    this.coins = this.physics.add.staticGroup();
    [[165, 108], [410, 108], [655, 108],
      [165, 204], [410, 204],
      [165, 300], [655, 300],
      [410, 396], [655, 396],
      [165, 492], [410, 492], [655, 492],
      [165, 60], [655, 156], [410, 252],
      [165, 348], [655, 444], [410, 540]].forEach(p => {
      const c = this.coins.create(p[0], p[1], 'coin');
      c.setDisplaySize(12, 12);
    });
  }
}
