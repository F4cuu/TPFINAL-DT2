class Level1Scene extends BaseLevel {
  constructor() { super('Level1Scene'); }

  getConfig() {
    return {
      time: 60, npcTarget: 4, spawnDelay: 2000, hazardSpeed: 200,
      hazardLanes: [300, 520],
      hazardSizes: { box: [30, 30], luggage: [36, 26], person: [20, 34] },
      nextScene: 'Level2Scene'
    };
  }

  getNpcPositions() {
    return [[180, 108], [180, 492], [630, 204], [630, 396]];
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
    [190, 410, 630].forEach(c => {
      [[60,60],[156,60],[252,60],[348,60],[444,60],[540,60]].forEach(([y, h]) => {
        const s = this.add.rectangle(c, y, 110, h, 0x555555);
        this.physics.add.existing(s, true); this.seats.add(s);
      });
    });
  }

  createCoins() {
    this.coins = this.physics.add.staticGroup();
    [[410, 108], [605, 108], [180, 204], [410, 300], [605, 300],
      [180, 396], [410, 492], [605, 492],
      [300, 60], [520, 60], [300, 156], [520, 156],
      [300, 252], [520, 252], [300, 348], [520, 348],
      [300, 444], [520, 444]].forEach(p => {
      const c = this.coins.create(p[0], p[1], 'coin');
      c.setDisplaySize(12, 12);
    });
  }
}
