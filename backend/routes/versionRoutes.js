import express from 'express';
import { saveVersion, getVersions, getVersionById, deleteVersion } from '../controllers/versionController.js';

const router = express.Router();

// 保存版本路由
router.post('/', saveVersion);

// 获取版本历史路由
router.get('/', getVersions);

// 获取单个版本路由
router.get('/:id', getVersionById);

// 删除版本路由
router.delete('/:id', deleteVersion);

export default router;
