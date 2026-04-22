import express from 'express';
import { createProject, getProjects, getProjectById, updateProject, deleteProject } from '../controllers/projectController.js';

const router = express.Router();

// 创建项目路由
router.post('/', createProject);

// 获取项目列表路由
router.get('/', getProjects);

// 获取单个项目路由
router.get('/:id', getProjectById);

// 更新项目路由
router.put('/:id', updateProject);

// 删除项目路由
router.delete('/:id', deleteProject);

export default router;
