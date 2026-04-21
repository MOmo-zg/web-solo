import express from 'express';
import { register, login, getCurrentUser } from '../controllers/authController.js';

const router = express.Router();

// 注册路由
router.post('/register', register);

// 登录路由
router.post('/login', login);

// 获取当前用户信息路由
router.get('/me', getCurrentUser);

export default router;
