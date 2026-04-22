import supabase from '../utils/supabase.js';
import { logger } from '../utils/logger.js';

// 创建项目
export const createProject = async (req, res) => {
  try {
    const { name, type, description } = req.body;
    logger.info('创建项目请求', { name, type, hasDescription: !!description });

    // 验证输入
    if (!name || !type) {
      logger.warn('创建项目缺少必要参数', { error: '请填写项目名称和类型' });
      return res.status(400).json({ error: '请填写项目名称和类型' });
    }

    // 开发环境模拟响应
    if (process.env.NODE_ENV !== 'production') {
      const mockProject = {
        id: Date.now().toString(),
        name,
        type,
        description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      logger.info('开发环境创建项目成功', { projectId: mockProject.id, projectName: mockProject.name });
      return res.status(201).json({ project: mockProject });
    }

    // 生产环境使用 Supabase
    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        name,
        type,
        description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('*')
      .single();

    if (error) {
      logger.error('创建项目失败', { error: error.message });
      return res.status(500).json({ error: '创建项目时出错' });
    }

    logger.info('创建项目成功', { projectId: project.id, projectName: project.name });
    res.status(201).json({ project });
  } catch (error) {
    logger.error('创建项目时出错', { error: error.message, stack: error.stack });
    // 开发环境模拟响应
    if (process.env.NODE_ENV !== 'production') {
      const { name, type, description } = req.body;
      const mockProject = {
        id: Date.now().toString(),
        name,
        type,
        description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      logger.info('开发环境创建项目成功（异常处理）', { projectId: mockProject.id, projectName: mockProject.name });
      return res.status(201).json({ project: mockProject });
    }
    res.status(500).json({ error: '服务器内部错误' });
  }
};

// 获取项目列表
export const getProjects = async (req, res) => {
  try {
    const { search, type, sortBy, sortOrder } = req.query;
    logger.info('获取项目列表请求', { search, type, sortBy, sortOrder });

    // 开发环境模拟响应
    if (process.env.NODE_ENV !== 'production') {
      let mockProjects = [
        {
          id: '1',
          name: '奇幻冒险小说',
          type: '奇幻',
          description: '一个关于勇者拯救世界的故事',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          name: '未来科幻故事',
          type: '科幻',
          description: '人类在火星的殖民故事',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          name: '古代历史传奇',
          type: '历史',
          description: '一个关于古代英雄的传奇故事',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '4',
          name: '现代都市爱情',
          type: '言情',
          description: '现代都市中的爱情故事',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      // 搜索功能
      if (search) {
        const searchTerm = search.toString().toLowerCase();
        mockProjects = mockProjects.filter(project => 
          project.name.toLowerCase().includes(searchTerm) || 
          project.description.toLowerCase().includes(searchTerm)
        );
      }

      // 类型筛选
      if (type) {
        mockProjects = mockProjects.filter(project => project.type === type);
      }

      // 排序功能
      if (sortBy) {
        const sortField = sortBy.toString();
        const order = sortOrder === 'asc' ? 1 : -1;
        mockProjects.sort((a, b) => {
          if (a[sortField] < b[sortField]) return -order;
          if (a[sortField] > b[sortField]) return order;
          return 0;
        });
      } else {
        // 默认按创建时间降序排序
        mockProjects.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }

      logger.info('开发环境获取项目列表成功', { projectCount: mockProjects.length });
      return res.status(200).json({ projects: mockProjects });
    }

    // 生产环境使用 Supabase
    let query = supabase.from('projects').select('*');

    // 搜索功能
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // 类型筛选
    if (type) {
      query = query.eq('type', type);
    }

    // 排序功能
    if (sortBy) {
      query = query.order(sortBy.toString(), {
        ascending: sortOrder === 'asc'
      });
    } else {
      // 默认按创建时间降序排序
      query = query.order('created_at', { ascending: false });
    }

    const { data: projects, error } = await query;

    if (error) {
      logger.error('获取项目列表失败', { error: error.message });
      return res.status(500).json({ error: '获取项目列表时出错' });
    }

    logger.info('获取项目列表成功', { projectCount: projects.length });
    res.status(200).json({ projects });
  } catch (error) {
    logger.error('获取项目列表时出错', { error: error.message, stack: error.stack });
    // 开发环境模拟响应
    if (process.env.NODE_ENV !== 'production') {
      const { search, type, sortBy, sortOrder } = req.query;
      let mockProjects = [
        {
          id: '1',
          name: '奇幻冒险小说',
          type: '奇幻',
          description: '一个关于勇者拯救世界的故事',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          name: '未来科幻故事',
          type: '科幻',
          description: '人类在火星的殖民故事',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          name: '古代历史传奇',
          type: '历史',
          description: '一个关于古代英雄的传奇故事',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '4',
          name: '现代都市爱情',
          type: '言情',
          description: '现代都市中的爱情故事',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      // 搜索功能
      if (search) {
        const searchTerm = search.toString().toLowerCase();
        mockProjects = mockProjects.filter(project => 
          project.name.toLowerCase().includes(searchTerm) || 
          project.description.toLowerCase().includes(searchTerm)
        );
      }

      // 类型筛选
      if (type) {
        mockProjects = mockProjects.filter(project => project.type === type);
      }

      // 排序功能
      if (sortBy) {
        const sortField = sortBy.toString();
        const order = sortOrder === 'asc' ? 1 : -1;
        mockProjects.sort((a, b) => {
          if (a[sortField] < b[sortField]) return -order;
          if (a[sortField] > b[sortField]) return order;
          return 0;
        });
      } else {
        // 默认按创建时间降序排序
        mockProjects.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }

      logger.info('开发环境获取项目列表成功（异常处理）', { projectCount: mockProjects.length });
      return res.status(200).json({ projects: mockProjects });
    }
    res.status(500).json({ error: '服务器内部错误' });
  }
};

// 获取单个项目
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info('获取单个项目请求', { projectId: id });

    // 开发环境模拟响应
    if (process.env.NODE_ENV !== 'production') {
      const mockProject = {
        id,
        name: '奇幻冒险小说',
        type: '奇幻',
        description: '一个关于勇者拯救世界的故事',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      logger.info('开发环境获取单个项目成功', { projectId: id, projectName: mockProject.name });
      return res.status(200).json({ project: mockProject });
    }

    // 生产环境使用 Supabase
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        logger.warn('项目不存在', { projectId: id });
        return res.status(404).json({ error: '项目不存在' });
      }
      logger.error('获取项目失败', { projectId: id, error: error.message });
      return res.status(500).json({ error: '获取项目时出错' });
    }

    logger.info('获取单个项目成功', { projectId: project.id, projectName: project.name });
    res.status(200).json({ project });
  } catch (error) {
    logger.error('获取单个项目时出错', { projectId: req.params.id, error: error.message, stack: error.stack });
    // 开发环境模拟响应
    if (process.env.NODE_ENV !== 'production') {
      const { id } = req.params;
      const mockProject = {
        id,
        name: '奇幻冒险小说',
        type: '奇幻',
        description: '一个关于勇者拯救世界的故事',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      logger.info('开发环境获取单个项目成功（异常处理）', { projectId: id, projectName: mockProject.name });
      return res.status(200).json({ project: mockProject });
    }
    res.status(500).json({ error: '服务器内部错误' });
  }
};

// 更新项目
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, description } = req.body;
    logger.info('更新项目请求', { projectId: id, name, type, hasDescription: !!description });

    // 验证输入
    if (!name || !type) {
      logger.warn('更新项目缺少必要参数', { projectId: id, error: '请填写项目名称和类型' });
      return res.status(400).json({ error: '请填写项目名称和类型' });
    }

    // 开发环境模拟响应
    if (process.env.NODE_ENV !== 'production') {
      const mockProject = {
        id,
        name,
        type,
        description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      logger.info('开发环境更新项目成功', { projectId: id, projectName: mockProject.name });
      return res.status(200).json({ project: mockProject });
    }

    // 生产环境使用 Supabase
    const { data: project, error } = await supabase
      .from('projects')
      .update({
        name,
        type,
        description,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        logger.warn('项目不存在', { projectId: id });
        return res.status(404).json({ error: '项目不存在' });
      }
      logger.error('更新项目失败', { projectId: id, error: error.message });
      return res.status(500).json({ error: '更新项目时出错' });
    }

    logger.info('更新项目成功', { projectId: project.id, projectName: project.name });
    res.status(200).json({ project });
  } catch (error) {
    logger.error('更新项目时出错', { projectId: req.params.id, error: error.message, stack: error.stack });
    // 开发环境模拟响应
    if (process.env.NODE_ENV !== 'production') {
      const { id } = req.params;
      const { name, type, description } = req.body;
      const mockProject = {
        id,
        name,
        type,
        description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      logger.info('开发环境更新项目成功（异常处理）', { projectId: id, projectName: mockProject.name });
      return res.status(200).json({ project: mockProject });
    }
    res.status(500).json({ error: '服务器内部错误' });
  }
};

// 删除项目
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info('删除项目请求', { projectId: id });

    // 开发环境模拟响应
    if (process.env.NODE_ENV !== 'production') {
      logger.info('开发环境删除项目成功', { projectId: id });
      return res.status(200).json({ message: '项目删除成功' });
    }

    // 生产环境使用 Supabase
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      logger.error('删除项目失败', { projectId: id, error: error.message });
      return res.status(500).json({ error: '删除项目时出错' });
    }

    logger.info('删除项目成功', { projectId: id });
    res.status(200).json({ message: '项目删除成功' });
  } catch (error) {
    logger.error('删除项目时出错', { projectId: req.params.id, error: error.message, stack: error.stack });
    // 开发环境模拟响应
    if (process.env.NODE_ENV !== 'production') {
      logger.info('开发环境删除项目成功（异常处理）', { projectId: req.params.id });
      return res.status(200).json({ message: '项目删除成功' });
    }
    res.status(500).json({ error: '服务器内部错误' });
  }
};
