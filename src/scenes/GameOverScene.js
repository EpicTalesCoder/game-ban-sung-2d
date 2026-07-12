export default class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOverScene'); }
  init(data) { this.score = data.score || 0; }
  create() {
    const { width, height } = this.scale;
    this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0);
    this.add.text(width / 2, height / 2 - 70, 'GAME OVER', {
      fontSize: '52px', color: '#ef5350', fontStyle: 'bold'
    }).setOrigin(0.5);
    this.add.text(width / 2, height / 2 - 10, 'Điểm: ' + this.score, {
      fontSize: '30px', color: '#ffffff'
    }).setOrigin(0.5);
    this.add.text(width / 2, height / 2 + 50, 'Nhấn chuột / phím bất kỳ để chơi lại', {
      fontSize: '22px', color: '#4fc3f7'
    }).setOrigin(0.5);
    this.input.once('pointerdown', () => this.scene.start('GameScene'));
    this.input.keyboard.once('keydown', () => this.scene.start('GameScene'));
  }
}
