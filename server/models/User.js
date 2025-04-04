// 引入mongoose模块，用于与MongoDB数据库交互
const mongoose = require('mongoose');
// 引入bcryptjs模块，用于密码加密
const bcrypt = require('bcryptjs');

// 定义用户模式（Schema）
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'], // 必填字段，提供错误信息
    unique: true, // 唯一字段
    trim: true, // 去除字符串两端的空白字符
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'], // 必填字段，提供错误信息
    minlength: 6, // 最小长度
    select: false, // 在查询结果中隐藏该字段
  },
  gameStats: {
    totalGames: { type: Number, default: 0 }, // 总游戏数
    wins: { type: Number, default: 0 }, // 胜利数
    losses: { type: Number, default: 0 }, // 失败数
  },
  createdAt: {
    type: Date,
    default: Date.now, // 默认值为当前时间
  },
});

// 定义保存前的钩子函数，用于加密密码
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 定义匹配密码的方法
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 导出用户模型
module.exports = mongoose.model('User', userSchema);