import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import versionRoutes from './routes/versionRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.get('/', (req, res) => {
  res.json({ message: '小说创作平台后端 API' });
});

// 认证路由
app.use('/api/auth', authRoutes);

// 项目路由
app.use('/api/projects', projectRoutes);

// 用户资料路由
app.use('/api/profile', profileRoutes);

// 版本历史路由
app.use('/api/versions', versionRoutes);

// AI 路由
app.use('/api/ai', aiRoutes);

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
