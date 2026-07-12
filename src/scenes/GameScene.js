import { ASSET_DATA } from '../assetsData.js';

const ROLE = {
  background: 'bg0',
  player: 's0',
  enemy: 'u4',
  bullet: 'erou',
  ground: 'l0',
  explosion: 'f2',
  cursor: 'curs',
};
const R = (k) => ROLE[k];

export default class GameScene extends Phaser.Scene {
  constructor() { super('GameScene'); }

  create() {
    const { width, height } = this.scale;

    // Nền (background asset, vẽ kéo dài)
    this.add.tileSprite(0, 0, width, height, R('background')).setOrigin(0).setScrollFactor(0);

    // Mặt đất (tile sprite lặp lại)
    this.ground = this.physics.add.staticGroup();
    for (let x = 0; x < width + 64; x += 64) {
      this.ground.create(x, height - 16, R('ground')).setOrigin(0, 0.5).refreshBody();
    }

    // Người chơi (asset s0.png)
    this.player = this.physics.add.sprite(120, height - 100, R('player'));
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.ground);

    // Nhóm đạn & kẻ địch
    this.bullets = this.physics.add.group();
    this.enemies = this.physics.add.group();

    this.physics.add.collider(this.enemies, this.ground);
    this.physics.add.overlap(this.bullets, this.enemies, this.hitEnemy, null, this);
    this.physics.add.overlap(this.player, this.enemies, this.takeDamage, null, this);

    // Con trỏ chuột (asset curs.png) - dùng data URI
    this.input.setDefaultCursor('url(' + R('cursor') + ') 0 0, crosshair');

    // Điều khiển
    this.keys = this.input.keyboard.addKeys({
      left: 'LEFT', right: 'RIGHT', up: 'UP', a: 'A', d: 'D', w: 'W', space: 'SPACE'
    });
    this.input.on('pointerdown', (p) => this.shoot(p.worldX, p.worldY));

    // HUD
    this.score = 0;
    this.health = 100;
    this.scoreText = this.add.text(16, 12, 'Điểm: 0', { fontSize: '22px', color: '#ffffff' }).setDepth(10);
    this.healthText = this.add.text(16, 40, 'Máu: 100', { fontSize: '22px', color: '#69f0ae' }).setDepth(10);

    // Spawn kẻ địch
    this.spawnTimer = this.time.addEvent({ delay: 1100, loop: true, callback: this.spawnEnemy, callbackScope: this });
    this.enemySpeed = 90;
    this.gameOver = false;
  }

  update(time, delta) {
    if (this.gameOver) return;
    const onGround = this.player.body.touching.down || this.player.body.blocked.down;

    if (this.keys.left.isDown || this.keys.a.isDown) this.player.setVelocityX(-220);
    else if (this.keys.right.isDown || this.keys.d.isDown) this.player.setVelocityX(220);
    else this.player.setVelocityX(0);

    if ((this.keys.up.isDown || this.keys.w.isDown || this.keys.space.isDown) && onGround) {
      this.player.setVelocityY(-480);
    }

    if (this.input.activePointer.isDown) {
      this.shoot(this.input.activePointer.worldX, this.input.activePointer.worldY);
    }

    this.bullets.getChildren().forEach(b => { if (b.x > this.scale.width + 50 || b.x < -50) b.destroy(); });
    this.enemies.getChildren().forEach(e => { if (e.x < -50) { e.destroy(); this.loseHealth(8); } });
  }

  shoot(tx, ty) {
    const now = this.time.now;
    if (now - (this.lastShot || 0) < 220) return;
    this.lastShot = now;
    const px = this.player.x, py = this.player.y - 6;
    const ang = Phaser.Math.Angle.Between(px, py, tx, ty);
    const b = this.bullets.create(px, py, R('bullet'));
    b.setRotation(ang);
    this.physics.velocityFromRotation(ang, 700, b.body.velocity);
    b.body.setAllowGravity(false);
  }

  spawnEnemy() {
    if (this.gameOver) return;
    const { width, height } = this.scale;
    const x = width + 40;
    const y = Phaser.Math.Between(height - 200, height - 60);
    const e = this.enemies.create(x, y, R('enemy'));
    e.body.setAllowGravity(true);
    e.setVelocityX(-this.enemySpeed);
    e.hp = 2;
    this.enemySpeed = Math.min(this.enemySpeed + 4, 240);
    this.spawnTimer.delay = Math.max(450, 1100 - this.score * 8);
  }

  hitEnemy(bullet, enemy) {
    bullet.destroy();
    enemy.hp -= 1;
    enemy.setTintFill(0xffffff);
    this.time.delayedCall(70, () => enemy.clearTint());
    if (enemy.hp <= 0) {
      this.score += 10;
      this.scoreText.setText('Điểm: ' + this.score);
      this.burst(enemy.x, enemy.y, 0xef5350);
      enemy.destroy();
    }
  }

  takeDamage(player, enemy) {
    if (this.gameOver) return;
    this.loseHealth(20);
    this.burst(enemy.x, enemy.y, 0xef5350);
    enemy.destroy();
  }

  loseHealth(amount) {
    this.health -= amount;
    this.healthText.setText('Máu: ' + Math.max(0, this.health));
    this.cameras.main.shake(120, 0.01);
    if (this.health <= 0 && !this.gameOver) {
      this.gameOver = true;
      this.physics.pause();
      this.time.delayedCall(300, () => this.scene.start('GameOverScene', { score: this.score }));
    }
  }

  burst(x, y, color) {
    // Hiệu ứng nổ bằng sprite f2.png
    const img = this.add.image(x, y, R('explosion')).setDepth(9);
    img.setTint(color).setScale(0.8);
    this.tweens.add({
      targets: img, scale: 1.6, alpha: 0, duration: 350,
      onComplete: () => img.destroy()
    });
  }
}
