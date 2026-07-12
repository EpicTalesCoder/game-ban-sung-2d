import { ASSET_DATA } from '../assetsData.js';

export default class PreloadScene extends Phaser.Scene {
  constructor() { super('PreloadScene'); }

  preload() {
    const { width, height } = this.scale;
    const barW = 360, barH = 28;
    const x = (width - barW) / 2, y = height / 2;

    this.add.text(width / 2, y - 50, 'ĐANG TẢI ASSETS...', {
      fontSize: '22px', color: '#4fc3f7'
    }).setOrigin(0.5);

    const box = this.add.graphics();
    box.fillStyle(0x222b3a, 1).fillRect(x - 4, y - 4, barW + 8, barH + 8);
    const bar = this.add.graphics();

    this.load.on('progress', (p) => {
      bar.clear();
      bar.fillStyle(0x4fc3f7, 1).fillRect(x, y, barW * p, barH);
    });

    // Load từ base64 data URI (không cần gọi mạng qua proxy)
    Object.entries(ASSET_DATA).forEach(([key, uri]) => {
      this.load.image(key, uri);
    });
  }

  create() {
    this.scene.start('GameScene');
  }
}
