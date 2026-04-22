import express from 'express';
import { getProjectMembers, inviteProjectMember, updateMemberRole, removeProjectMember } from '../controllers/collaborationController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// 获取项目成员列表路由
router.get('/projects/:projectId/members', authMiddleware, getProjectMembers);

// 邀请项目成员路由
router.post('/projects/:projectId/members', authMiddleware, inviteProjectMember);

// 更新成员角色路由
router.put('/projects/:projectId/members/:memberId', authMiddleware, updateMemberRole);

// 移除项目成员路由
router.delete('/projects/:projectId/members/:memberId', authMiddleware, removeProjectMember);

export default router;
