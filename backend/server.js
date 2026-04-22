import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import versionRoutes from './routes/versionRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import collaborationRoutes from './routes/collaborationRoutes.js';
import { logger, accessLogMiddleware, errorHandlerMiddleware, notFoundMiddleware } from './utils/logger.js';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());
app.use(accessLogMiddleware);

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

// 协作路由
app.use('/api/collaboration', collaborationRoutes);

// 404 处理
app.use(notFoundMiddleware);

// 错误处理
app.use(errorHandlerMiddleware);

// 启动服务器
app.listen(PORT, () => {
  logger.info(`服务器运行在 http://localhost:${PORT}`);
});
