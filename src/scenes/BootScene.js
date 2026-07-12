export default class BootScene extends Phaser.Scene {
  constructor() { super('BootScene'); }
  create() {
    this.makeTextures();
    this.scene.start('GameScene');
  }
  makeTextures() {
    let g = this.make.graphics({ x: 0, y: 0, add: false });
    // player (thân + súng)
    g.fillStyle(0x4fc3f7, 1); g.fillRoundedRect(0, 0, 32, 48, 6);
    g.fillStyle(0x0277bd, 1); g.fillRect(22, 18, 18, 8);
    g.generateTexture('player', 40, 48); g.destroy();
    // đạn
    g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0xffeb3b, 1); g.fillRect(0, 0, 14, 6);
    g.generateTexture('bullet', 14, 6); g.destroy();
    // kẻ địch
    g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0xef5350, 1); g.fillRoundedRect(0, 0, 34, 34, 6);
    g.fillStyle(0x000000, 1); g.fillCircle(11, 12, 3); g.fillCircle(23, 12, 3);
    g.generateTexture('enemy', 34, 34); g.destroy();
    // mặt đất
    g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x37474f, 1); g.fillRect(0, 0, 64, 32);
    g.fillStyle(0x455a64, 1); g.fillRect(0, 0, 64, 6);
    g.generateTexture('ground', 64, 32); g.destroy();
    // hạt hiệu ứng
    g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0xffffff, 1); g.fillRect(0, 0, 4, 4);
    g.generateTexture('particle', 4, 4); g.destroy();
  }
}
