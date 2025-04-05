// 平台类型枚举
export const PLATFORM = {
  WEB: 'web',
  TT: 'tt', // 抖音小程序
  WX: 'wx'  // 微信小程序
};

// 获取当前平台
export function getPlatform() {
  if (typeof tt !== 'undefined') {
    return PLATFORM.TT;
  } else if (typeof wx !== 'undefined') {
    return PLATFORM.WX;
  } else {
    return PLATFORM.WEB;
  }
}

// 平台特定的API适配
export const platformAPI = {
  // 获取系统信息
  getSystemInfo() {
    const platform = getPlatform();
    switch (platform) {
      case PLATFORM.TT:
        return tt.getSystemInfoSync();
      case PLATFORM.WX:
        return wx.getSystemInfoSync();
      default:
        return {
          windowWidth: window.innerWidth,
          windowHeight: window.innerHeight,
          pixelRatio: window.devicePixelRatio
        };
    }
  },

  // 创建画布
  createCanvas(width, height) {
    const platform = getPlatform();
    switch (platform) {
      case PLATFORM.TT:
        return tt.createCanvasContext('gameCanvas');
      case PLATFORM.WX:
        return wx.createCanvasContext('gameCanvas');
      default:
        return document.createElement('canvas');
    }
  },

  // 请求动画帧
  requestAnimationFrame(callback) {
    const platform = getPlatform();
    switch (platform) {
      case PLATFORM.TT:
        return tt.requestAnimationFrame(callback);
      case PLATFORM.WX:
        return wx.requestAnimationFrame(callback);
      default:
        return window.requestAnimationFrame(callback);
    }
  },

  // 取消动画帧
  cancelAnimationFrame(id) {
    const platform = getPlatform();
    switch (platform) {
      case PLATFORM.TT:
        return tt.cancelAnimationFrame(id);
      case PLATFORM.WX:
        return wx.cancelAnimationFrame(id);
      default:
        return window.cancelAnimationFrame(id);
    }
  }
};

// 平台特定的资源加载
export const platformAssets = {
  // 加载图片
  loadImage(src) {
    const platform = getPlatform();
    return new Promise((resolve, reject) => {
      switch (platform) {
        case PLATFORM.TT:
        case PLATFORM.WX:
          const image = platform === PLATFORM.TT ? tt.createImage() : wx.createImage();
          image.onload = () => resolve(image);
          image.onerror = reject;
          image.src = src;
          break;
        default:
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
      }
    });
  }
}; 