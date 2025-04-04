const jwt = require('jsonwebtoken'); // 引入jsonwebtoken模块
const User = require('../models/User'); // 引入User模型

exports.protect = async (req, res, next) => { // 定义中间件函数protect
  try {
    let token;

    if (
      req.headers.authorization && // 检查请求头中是否存在authorization字段
      req.headers.authorization.startsWith('Bearer') // 检查authorization字段是否以Bearer开头
    ) {
      token = req.headers.authorization.split(' ')[1]; // 提取token
    }

    if (!token) { // 如果没有token
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route', // 返回未授权错误
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // 验证token
    req.user = await User.findById(decoded.id); // 根据token中的id查找用户
    next(); // 调用next函数进入下一个中间件
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Not authorized to access this route', // 捕获错误并返回未授权错误
    });
  }
};