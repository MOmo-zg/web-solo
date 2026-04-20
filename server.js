const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 导入路由
const agentRoutes = require('./backend/routes/agent');
const rulesRoutes = require('./backend/routes/rules');
const skillsRoutes = require('./backend/routes/skills');

// 使用路由
app.use('/api/agent', agentRoutes);
app.use('/api/rules', rulesRoutes);
app.use('/api/skills', skillsRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});