import Phaser from 'phaser';

export class AIPlayer {
    constructor(scene) {
        this.scene = scene;
        this.spawnInterval = 3000; // 每3秒生成一个单位
        this.lastSpawnTime = 0;

        setInterval(() => {
            this.generateUnit();
        }, this.spawnInterval);
    }

    generateUnit() {
        this.scene.spawnUnit('ai-player', 'knight', 50, 50);
    }
} 