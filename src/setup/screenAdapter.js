// ===== 屏幕适配核心方法 =====
function setupScreenAdapter() {
    // 1. 创建动态背景（覆盖全屏）
    const bg = this.add.graphics()
    .fillStyle(0x000000) // 与HTML背景色一致
    .fillRect(0, 0, this.scale.width, this.scale.height)
    .setScrollFactor(0);

    // 2. 创建安全区容器（核心内容）
    this.safeZone = this.add.container(0, 0);
    
    // 3. 动态适配逻辑
    const updateSafeZone = () => {
    const DESIGN_RATIO = 390 / 844;
    const screenRatio = this.scale.width / this.scale.height;
    
    if (screenRatio < DESIGN_RATIO) { // 更长的屏幕
        const scale = this.scale.width / 390;
        this.safeZone
        .setScale(scale)
        .setPosition(0, (this.scale.height - 844 * scale) / 2);
    } else { // 更宽的屏幕
        const scale = this.scale.height / 844;
        this.safeZone
        .setScale(scale)
        .setPosition((this.scale.width - 390 * scale) / 2, 0);
    }

    // 4. 底部延伸层（消除黑边）
    this.add.rectangle(0, this.scale.height - 1, this.scale.width, 1, 0x000000)
        .setOrigin(0)
        .setScrollFactor(0)
        .setDepth(9999);
    };

    // 初始调用 + 监听resize
    updateSafeZone();
    this.scale.on('resize', updateSafeZone);

}

export { setupScreenAdapter }