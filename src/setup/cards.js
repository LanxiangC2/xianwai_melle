
 // ===== 卡牌系统 =====
function setupCardSystem() {
    this.cards = this.add.group();

    // 获取屏幕尺寸
    const screenWidth = this.scale.width;
    const screenHeight = this.scale.height;

    // 卡牌参数配置
    const cardConfig = {
        count: 4,            // 卡牌数量
        width: 60,           // 单卡宽度
        height: 80,         // 单卡高度
        margin: 10,          // 卡牌间距
        bottomOffset: 80   // 距离底部的偏移量
    };

    // 计算卡牌起始X坐标（水平居中）
    const totalWidth = (cardConfig.width * cardConfig.count) 
                     + (cardConfig.margin * (cardConfig.count - 1));
    const startX = (screenWidth - totalWidth) / 2;

    // 计算卡牌Y坐标（固定在底部）
    const cardY = screenHeight - cardConfig.bottomOffset;

    for (let i = 0; i < cardConfig.count; i++) {
        // 创建卡牌元素...
        const cardBg = this.add.rectangle(0, 0, cardConfig.width, cardConfig.height, 0xFFD700)
            .setStrokeStyle(2, 0x000000);

        const cardIcon = this.add.sprite(0, 0, 'units', 0)
            .setDisplaySize(40, 40);

        // 动态计算水平位置
        const cardX = startX 
                    + (i * cardConfig.width) 
                    + (i * cardConfig.margin);

        const card = this.add.container(cardX, cardY, [cardBg, cardIcon])
            .setSize(cardConfig.width, cardConfig.height)
            .setInteractive()
            .setDataEnabled();

        // --- 绑定卡牌数据 ---
        card.data.set({ type: 'knight', cost: 3 });
        this.input.setDraggable(card);
        this.cards.add(card);
    }

    // 拖拽事件
    this.input.on('dragstart', (pointer, gameObject) => {
        gameObject.alpha = 0.5;

        // 创建半透明副本（浅色效果）
        this.dragGhost = this.add.sprite(gameObject.x, gameObject.y, 'units', 0)
            .setAlpha(0.5)
            .setTint(0x88ff88) // 浅绿色高亮
            .setDepth(9999)    // 确保在最上层
            .setScale(gameObject.scaleX * 1.1); // 略微放大

        // 创建合法区域指示器（可选）范围只能在我方区域
        this.validArea = this.add.rectangle(
            screenWidth/2, 
            (screenHeight * .8) * (3/4), 
            screenWidth, 
            (screenHeight * .8) / 2, 
            0x88ff88 , 
            0.2
        )
            .setDepth(9998)
            .setStrokeStyle(2, 0x88ff88);
    });

    // 拖拽过程中更新位置
    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
        // 更新幽灵位置
        this.dragGhost.setPosition(dragX, dragY);
        
        // 动态改变颜色（根据是否在合法区域）
        const isValid = _checkValidPosition(dragX, dragY);
        this.dragGhost.setTint(isValid ? 0x88ff88 : 0xff8888);
        this.validArea.setFillStyle(isValid ? 0x88ff88 : 0xff8888, 0.2);
    });

    // 拖拽结束事件
    this.input.on('dragend', (pointer, gameObject) => {
        this.dragGhost.destroy();
        this.validArea.destroy();

        gameObject.alpha = 1;

        // y 方向不能超过战场区域的一半, 并且在战场区域内
        if ((pointer.y > this.scale.height * 0.8 / 2) && (pointer.y < this.scale.height * 0.8)) {
            this.spawnUnit(gameObject.data.get('type'), pointer.x, pointer.y);
        }
    });

    // ===== 辅助方法 =====
    function _checkValidPosition(x, y) {
        // 判断坐标是否在战场区域内
        return y < screenHeight && y > (screenHeight * 0.8) / 2;
    }
}

export { setupCardSystem }