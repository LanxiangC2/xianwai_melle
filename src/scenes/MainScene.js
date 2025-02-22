import { setupScreenAdapter } from '../setup/screenAdapter.js'
import { setupBattlefield, createBarriers } from '../setup/battlefield.js';
import { setupCardSystem } from '../setup/cards.js';
import { watchBarrierAndUnitColide, watchUnitAndUnitColide, passingBarrier } from '../collides/units.js'
import { HealthBar } from '../components/health.js';

export class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.units = null;    // 动态单位组
        this.statics = null;    // 静态单位组
        this.barriers = null;    // 障碍物组
        this.cards = null;    // 卡牌组
        this.playerTower = null; // 玩家防御塔
        this.playerTowerHealth = null; // 玩家防御塔血量
        this.enemyTower = null;  // 敌方防御塔
        this.enemyTowerHealth = null;  // 敌方防御塔血量
        this.playerCurrentHealth = null; // 玩家血量文本
        this.enemyCurrentHealth = null;  // 敌方血量文本

        // 新增适配相关属性
        this.safeZone = null;
        this.battleHeight = null;
    }

    preload() {
        // 无需加载图片资源

        // 2. 加载精灵表
        this.load.spritesheet('units', 'assets/roguelikeChar_transparent.png', {
            frameWidth: 16,
            frameHeight: 16
        });

        // this.load.spritesheet('statics', 'assets/tilemap.png', {
        //     frameWidth: 16,
        //     frameHeight: 16
        // })

        this.load.atlas('statics', 'assets/tilemap.png', 'assets/tilemap.json');
    }

    create() {
        // 核心适配解决方案
        // setupScreenAdapter.call(this);
        
        this.units = this.physics.add.group(); // 初始化物理单位组
        this.statics = this.physics.add.group(); // 初始化静态单位组
        
        
        setupBattlefield.call(this);               // 初始化战场
        setupCardSystem.call(this);                // 初始化卡牌系统
        createBarriers.call(this);                 // 创建路障
        
    }

    // ===== 生成单位 =====
    spawnUnit(type, x, y) {
        if (type === 'knight') {
            const knight = this.physics.add.sprite(x, y, 'units', 0)
               .setDataEnabled() // 关键修复：启用数据存储
               .setScale(2)
               .setData('damage', 50)
               .setCircle(4, 4, 4)
               .setCollideWorldBounds(true) // 防止移出屏幕外

            // 将单位加入组
            this.units.add(knight);
            // 给单位创建血条
            knight.healthBar = new HealthBar(this, knight, 200, false, {
                offsetY: -20,
                barWidth: 30,
                barHeight: 6,
                round: 2,
                textSize: '10px'
            });

            // 自动寻敌逻辑
            knight.update = () => {
                const enemy = this.findNearestEnemy(knight);
                enemy && this.moveToTarget(knight, enemy);
                knight.healthBar.followSprite(); // 让血条跟随精灵移动
            };
        }
    }

    // ===== 单位AI逻辑 =====
    findNearestEnemy(unit) {
        // 如果敌方塔已被摧毁，不再返回目标
        if (!this.enemyTower || !this.enemyTower.gameObject.active) {
            return null;
        }

        // 否则优先攻击敌方塔
        return this.enemyTower.gameObject;
    }
    // 移动到目标位置
    moveToTarget(unit, target) {

        if (unit.isBypassingBarrier) {
            passingBarrier(unit);
            return 
        }
        // 无目标时停止移动
        if (!target) {
            unit.setVelocity(0, 0);
            return;
        }

        // 计算与目标的距离
        const distance = Phaser.Math.Distance.Between(unit.x, unit.y, target.x, target.y);

        // 接近目标后停止移动
        if (distance < 10) {
            unit.setVelocity(0, 0);
            return;
        }

        // 继续移动
        this.physics.moveToObject(unit, target, 50);
    }

    // ===== 碰撞检测 =====
    update() {
        this.physics.collide(
            this.units,
            [this.playerTower?.gameObject, this.enemyTower?.gameObject],
            (tower, unit) => {
                if (unit.active && tower.active) {
                    this.onUnitHitTower(unit, tower);
                }
            }
        );

        // 碰撞检测：单位与障碍物
        watchBarrierAndUnitColide.call(this);

        // 碰撞检测：单位与单位
        watchUnitAndUnitColide.call(this);


        // 调用单位的 update 方法
        this.units.getChildren().forEach(unit => {
            if (unit.update) {
                unit.update();
            }
        });
    }

    // ===== 碰撞处理 =====
    onUnitHitTower(unit, tower) {
        // 添加攻击冷却（1秒内只能攻击一次）
        if (unit.attackCooldown > Date.now()) return;
        unit.attackCooldown = Date.now() + 1000; // 冷却时间1秒

        const damage = unit.getData('damage');

        // 敌方塔扣血逻辑
        if (tower === this.enemyTower?.gameObject) { // 使用可选链避免undefined
            const curHealth = this.enemyCurrentHealth
            const newHealth = curHealth - damage;
            this.enemyCurrentHealth = newHealth;
            // 更新敌方塔血量
            this.enemyTowerHealth.update(newHealth);

            if (newHealth <= 0) {
                // 销毁敌方塔的图形和物理体
                this.enemyTower.gameObject.destroy();
                this.enemyTower.destroy();
                this.enemyTower = null;
                this.gameOver(true);
            }
        }

        // 玩家塔扣血逻辑（同理）
        if (tower === this.playerTower?.gameObject) {
            const currentHealth = this.playerCurrentHealth;
            const newHealth = currentHealth - damage;
            this.playerCurrentHealth = newHealth
            // 更新玩家塔血量
            this.playerTowerHealth.update(newHealth);

            if (newHealth <= 0) {
                this.playerTower.gameObject.destroy();
                this.playerTower.destroy();
                this.playerTower = null;
                this.gameOver(false);
            }
        }

        // unit.destroy(); // 销毁攻击单位
    }

    // ===== 游戏结束 =====
    gameOver(isPlayerWin) {
        // 显示胜利文本
        this.add.text(this.scale.width / 2, this.scale.height * 0.5, isPlayerWin ? '胜利!' : '失败!', {
            fontSize: '48px',
            fill: '#ff0',
            backgroundColor: 'rgba(0,0,0,0.6)'
        }).setOrigin(0.5);

        // 停止物理引擎
        this.physics.pause();

        // 清除所有单位
        this.units.clear(true, true); // true: 销毁子项并移除物理体

        // 禁用卡牌拖拽
        this.input.off('dragstart');
        this.input.off('dragend');
    }
}