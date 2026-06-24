function createGameTextures(scene) {
  const keys = ['player', 'npc', 'box', 'luggage', 'person', 'wall', 'coin'];
  const defs = [
    { k: 'player', c: 0x4ecdc4, w: 26, h: 36 },
    { k: 'npc', c: 0xff9800, w: 20, h: 30 },
    { k: 'box', c: 0x8b4513, w: 30, h: 30 },
    { k: 'luggage', c: 0xd4a574, w: 36, h: 26 },
    { k: 'person', c: 0xff69b4, w: 20, h: 34 },
    { k: 'wall', c: 0x666666, w: 16, h: 60 },
    { k: 'coin', c: 0xffd700, w: 12, h: 12 },
    { k: 'enemy', c: 0xff0000, w: 24, h: 34 },
  ];
  defs.forEach(d => {
    if (scene.textures.exists(d.k)) return;
    const g = scene.add.graphics();
    g.fillStyle(d.c, 1); g.fillRect(0, 0, d.w, d.h);
    g.generateTexture(d.k, d.w, d.h); g.destroy();
  });
}
