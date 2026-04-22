import express from 'express';
import { updateProfile, getProfile, changePassword } from '../controllers/profileController.js';

const router = express.Router();

// 获取用户资料路由
router.get('/', getProfile);

// 更新用户资料路由
router.put('/', updateProfile);

// 修改密码路由
router.post('/change-password', changePassword);

export default router;
