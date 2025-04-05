import { getPlatform, PLATFORM, platformAPI, platformAssets } from './platform';

export class PhaserAdapter {
  constructor(config) {
    this.platform = getPlatform();
    this.config = config;
    this.game = null;
  }

  init() {
    if (this.platform === PLATFORM.WEB) {
      // Web 环境直接使用 Phaser
      this.game = new Phaser.Game(this.config);
    } else {
      // 小程序环境需要特殊处理
      this.adaptForMiniProgram();
    }
  }

  adaptForMiniProgram() {
    const systemInfo = platformAPI.getSystemInfo();
    
    // 调整配置以适应小程序环境
    this.config = {
      ...this.config,
      type: Phaser.CANVAS,
      canvas: platformAPI.createCanvas(systemInfo.windowWidth, systemInfo.windowHeight),
      width: systemInfo.windowWidth,
      height: systemInfo.windowHeight,
      render: {
        pixelArt: true,
        antialias: false
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    };

    // 创建游戏实例
    this.game = new Phaser.Game(this.config);

    // 适配资源加载
    this.adaptAssetLoading();
  }

  adaptAssetLoading() {
    // 重写 Phaser 的加载器以适配小程序环境
    const originalLoadImage = Phaser.Loader.FileTypes.ImageFile.prototype.load;
    
    Phaser.Loader.FileTypes.ImageFile.prototype.load = function() {
      if (this.platform === PLATFORM.WEB) {
        return originalLoadImage.call(this);
      }

      return new Promise((resolve, reject) => {
        platformAssets.loadImage(this.url)
          .then(image => {
            this.data = image;
            resolve();
          })
          .catch(reject);
      });
    };
  }

  // 获取游戏实例
  getGame() {
    return this.game;
  }

  // 销毁游戏实例
  destroy() {
    if (this.game) {
      this.game.destroy();
      this.game = null;
    }
  }
} 