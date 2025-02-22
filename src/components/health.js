class HealthBar {
    constructor(scene, stuff, maxHealth, isStatic = true, options = {}) {
      this.stuff = stuff;
      this.maxHealth = maxHealth;
      this.barWidth = options.barWidth || 60; // 血条宽度
      this.barHeight = options.barHeight || 8;  // 血条高度
      this.offsetY = options.offsetY || -50;  // 相对物体的垂直偏移
      this.isStatic = isStatic;
  
      // 血条容器（自动跟随防御塔）
      this.container = scene.add.container(stuff.x, stuff.y + this.offsetY);
      
      // 血条背景（深色）
      this.bg = scene.add.graphics()
        .fillStyle(0x444444, 0.8)
        .fillRoundedRect(-this.barWidth/2, 0, this.barWidth, this.barHeight, options.round || 4);
      
      // 当前血量条（动态变化）
      this.fg = scene.add.graphics()
        .fillStyle(0x00ff00, 1)
        .fillRoundedRect(-this.barWidth/2, 0, this.barWidth, this.barHeight, options.round || 4);
      
      // 血量文本（居中显示）
      this.text = scene.add.text(0, -2, maxHealth, { 
        fontSize: options.textSize || '12px', 
        fontFamily: 'Arial',
        color: '#FFFFFF',
        stroke: '#000000',
        strokeThickness: 2 
      }).setOrigin(0.5, 0.5);
  
      this.container.add([this.bg, this.fg, this.text]);
      this.container.setDepth(100); // 确保在顶层
    }
  
    update(currentHealth) {
      const percent = currentHealth / this.maxHealth;
      
      // 动态颜色（绿->黄->红）
      const color = Phaser.Display.Color.Interpolate.ColorWithColor(
        Phaser.Display.Color.ValueToColor(0x00ff00),
        Phaser.Display.Color.ValueToColor(0xff0000),
        100,
        100 - (percent * 100)
      ).color;
  
      // 更新血条
      this.fg.clear()
        .fillStyle(color, 1)
        .fillRoundedRect(
          -this.barWidth/2, 0, 
          this.barWidth * percent, // 动态宽度
          this.barHeight, 
          4
        );
  
      // 更新文本
      this.text.setText(`${Math.floor(currentHealth)}`);
      
      // 受伤动画（可选）
      if (percent < 0.3) {
        this.startLowHealthEffect();
      }
    }
  
    startLowHealthEffect() {
      // 低血量闪烁效果
      this.stuff.scene.tweens.add({
        targets: this.fg,
        alpha: 0.3,
        duration: 300,
        yoyo: true,
        repeat: -1
      });
    }

    followSprite() {
      // 让血条容器跟随精灵移动
      this.container.x = this.stuff.x;
      this.container.y = this.stuff.y + this.offsetY;
  }
  }


  export { HealthBar }