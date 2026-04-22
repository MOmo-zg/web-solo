import express from 'express';
import { generateContent, generateTitle, generateOutline, analyzeContent, generateCharacter } from '../controllers/aiController.js';

const router = express.Router();

// 生成小说内容路由
router.post('/generate-content', generateContent);

// 生成小说标题路由
router.post('/generate-title', generateTitle);

// 生成小说大纲路由
router.post('/generate-outline', generateOutline);

// 分析小说内容路由
router.post('/analyze-content', analyzeContent);

// 生成角色发展路由
router.post('/generate-character', generateCharacter);

export default router;
