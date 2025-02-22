import { MainScene } from './scenes/MainScene.js';

// const config = {
//   type: Phaser.AUTO,
//   width: 800,   // 设计分辨率
//   height: 600,
//   scene: [MainScene],
//   audio: { noAudio: true }, // 禁用音频
//   physics: {
//     default: 'arcade',
//     arcade: { 
//       gravity: { y: 0 },
  
//       debug: true // 开启调试模式查看碰撞框
//     } // 无重力，仅用于碰撞检测
    
//   }
// };

const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.ENVELOP, // 核心模式（必须启用）
    parent: 'game-container',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 390,   // 基于iPhone 12/13 mini竖屏尺寸
    height: 844,   // 推荐使用 9:19.5 比例（覆盖主流全面屏）
    resolution: window.devicePixelRatio,
    min: {
      width: 320,   // 覆盖iPhone 5/SE等小屏
      height: 568
    },
    max: {
      width: 600,   // 覆盖折叠屏设备
      height: 1440
    },
    autoRound: true,  // 避免亚像素模糊
    expandParent: true // 关键！允许扩展父容器
  },
  physics: {
    default: 'arcade',
    arcade: { 
      debug: true,
      gravity: { y: 0 }
    }
  },
  scene: [MainScene],
  // 新增移动端优化参数
  input: {
    touch: {
      capture: true // 阻止浏览器默认触摸行为
    }
  },
  dom: {
    createContainer: true // 启用DOM容器支持
  },
  fps: {
    target: 60,         // 强制60FPS
    smoothStep: true    // 避免帧率波动
  }
};
new Phaser.Game(config);