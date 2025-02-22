    import { HealthBar } from "../components/health.js";
    
    // ===== 战场初始化 =====
    function setupBattlefield() {
        const battleWidth = this.scale.width;
        const battleHeight = this.scale.height * .8; // 战场高度占屏幕高度的80%

        // 添加战场背景
        this.add.tileSprite(
            battleWidth / 2,   // X中心坐标
            battleHeight / 2,  // Y中心坐标
            battleWidth,       // 显示宽度（与战场同宽）
            battleHeight,      // 显示高度
            'statics',         // 纹理集key
            'grass_0'          // 使用的帧名称
        )
        .setOrigin(0.5, 0.5)  // 从中心点开始填充
        .setDepth(-1);        // 确保在底层

        // 添加 Tower
        this.playerTowerGraphic = this.add.sprite(battleWidth / 2, battleHeight * 0.85, 'statics', 'tower_0');
        // 创建血量条
        this.playerTowerHealth = new HealthBar(this, this.playerTowerGraphic, 2000);
        this.playerCurrentHealth = 2000;
        this.playerTower = this.physics.add.existing(this.playerTowerGraphic, { isStatic: true }).body;

        this.enemyTowerGraphic = this.add.sprite(battleWidth / 2, battleHeight * 0.15, 'statics', 'tower_1');
        // 创建血量条
        this.enemyTowerHealth = new HealthBar(this, this.enemyTowerGraphic, 2000);
        this.enemyCurrentHealth = 2000;
        this.enemyTower = this.physics.add.existing(this.enemyTowerGraphic, { isStatic: true }).body;
        // this.enemyTower.setOffset(0, -5);
    }

    /**
     *  创建路障
     *  */
    function createBarriers() {
        // 创建一个组来存储障碍物
        this.barriers = this.add.group();

        // 获取战场的宽度和高度
        const battleWidth = this.scale.width;
        const battleHeight = this.scale.height * .8; // 战场高度占屏幕高度的80%

        // 设置障碍物的数量
        const numBarriers = 9;
        // 计算障碍物的起始X坐标
        const startX = (battleWidth - (16 * numBarriers)) / 2;
        // 计算障碍物的起始Y坐标
        const startY = (battleHeight) / 2;

        

        const barriersContainer = this.add.container(0, 0);

        // 创建一个矩形来代表合并后的路障碰撞体
        const combinedBarrier = this.add.rectangle(
            battleWidth / 2, 
            startY, 
            16 * numBarriers, 
            16, 
            0x000000, // 这里设置为透明颜色，仅用于碰撞检测
            0
        );

        // 将合并后的碰撞体添加到物理引擎中，并设置为静态物体
        this.physics.add.existing(combinedBarrier, { 
            isStatic: true,
        });

        // 将合并后的碰撞体添加到障碍物组中
        this.barriers.add(combinedBarrier);



        // 循环添加障碍物
        for (let i = 0; i <= numBarriers; i++) {
            // 添加一个精灵作为障碍物(仅仅是视觉)
             this.add.sprite(startX + i * 16, startY, 'statics', 'tree_0')
            // 将障碍物添加到物理引擎中，并设置其为静态物体
            // this.physics.add.existing(barrierGraphic, { 
            //     isStatic: true,
            // });
            // 将障碍物添加到容器中
            // barriersContainer.add(barrierGraphic);
            // 将障碍物添加到障碍物组中
            // this.barriers.add(barrierGraphic);
        }
    }

    export { setupBattlefield, createBarriers }