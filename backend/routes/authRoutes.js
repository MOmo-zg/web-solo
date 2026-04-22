import express from 'express';
import { register, login, getCurrentUser, resetPassword, uploadAvatar } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// 注册路由
router.post('/register', register);

// 登录路由
router.post('/login', login);

// 获取当前用户信息路由（需要认证）
router.get('/me', authMiddleware, getCurrentUser);

// 重置密码路由
router.post('/reset-password', resetPassword);

// 上传头像路由（需要认证）
router.post('/upload-avatar', authMiddleware, uploadAvatar);

export default router;
