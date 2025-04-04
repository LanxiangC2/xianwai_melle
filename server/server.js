require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// 连接数据库
connectDB();

const app = express();

// 中间件
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// 路由
app.use('/api/auth', require('./routes/auth'));

// 测试路由
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Melle Game API' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});