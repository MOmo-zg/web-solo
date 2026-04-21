import supabase from '../utils/supabase.js';

// 保存内容版本
export const saveVersion = async (req, res) => {
  try {
    const { projectId, chapterId, content, title, description } = req.body;

    // 验证输入
    if (!projectId || !content) {
      return res.status(400).json({ error: '请填写项目 ID 和内容' });
    }

    // 开发环境模拟响应
    if (process.env.NODE_ENV !== 'production') {
      const mockVersion = {
        id: Date.now().toString(),
        project_id: projectId,
        chapter_id: chapterId,
        content,
        title: title || '未命名版本',
        description,
        created_at: new Date().toISOString()
      };
      return res.status(201).json({ version: mockVersion });
    }

    // 生产环境使用 Supabase
    const { data: version, error } = await supabase
      .from('versions')
      .insert({
        project_id: projectId,
        chapter_id: chapterId,
        content,
        title: title || '未命名版本',
        description,
        created_at: new Date().toISOString()
      })
      .select('*')
      .single();

    if (error) {
      return res.status(500).json({ error: '保存版本时出错' });
    }

    res.status(201).json({ version });
  } catch (error) {
    // 开发环境模拟响应
    if (process.env.NODE_ENV !== 'production') {
      const { projectId, chapterId, content, title, description } = req.body;
      const mockVersion = {
        id: Date.now().toString(),
        project_id: projectId,
        chapter_id: chapterId,
        content,
        title: title || '未命名版本',
        description,
        created_at: new Date().toISOString()
      };
      return res.status(201).json({ version: mockVersion });
    }
    res.status(500).json({ error: '服务器内部错误' });
  }
};

// 获取版本历史
export const getVersions = async (req, res) => {
  try {
    const { projectId, chapterId } = req.query;

    // 验证输入
    if (!projectId) {
      return res.status(400).json({ error: '请提供项目 ID' });
    }

    // 开发环境模拟响应
    if (process.env.NODE_ENV !== 'production') {
      const mockVersions = [
        {
          id: '1',
          project_id: projectId,
          chapter_id: chapterId,
          content: '这是第一个版本的内容',
          title: '初始版本',
          description: '故事的开始',
          created_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: '2',
          project_id: projectId,
          chapter_id: chapterId,
          content: '这是修改后的内容',
          title: '修改版本 1',
          description: '更新了故事内容',
          created_at: new Date(Date.now() - 1800000).toISOString()
        },
        {
          id: '3',
          project_id: projectId,
          chapter_id: chapterId,
          content: '这是最新版本的内容',
          title: '最新版本',
          description: '完善了故事情节',
          created_at: new Date().toISOString()
        }
      ];
      return res.status(200).json({ versions: mockVersions });
    }

    // 生产环境使用 Supabase
    let query = supabase
      .from('versions')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (chapterId) {
      query = query.eq('chapter_id', chapterId);
    }

    const { data: versions, error } = await query;

    if (error) {
      return res.status(500).json({ error: '获取版本历史时出错' });
    }

    res.status(200).json({ versions });
  } catch (error) {
    // 开发环境模拟响应
    if (process.env.NODE_ENV !== 'production') {
      const { projectId, chapterId } = req.query;
      const mockVersions = [
        {
          id: '1',
          project_id: projectId,
          chapter_id: chapterId,
          content: '这是第一个版本的内容',
          title: '初始版本',
          description: '故事的开始',
          created_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: '2',
          project_id: projectId,
          chapter_id: chapterId,
          content: '这是修改后的内容',
          title: '修改版本 1',
          description: '更新了故事内容',
          created_at: new Date(Date.now() - 1800000).toISOString()
        },
        {
          id: '3',
          project_id: projectId,
          chapter_id: chapterId,
          content: '这是最新版本的内容',
          title: '最新版本',
          description: '完善了故事情节',
          created_at: new Date().toISOString()
        }
      ];
      return res.status(200).json({ versions: mockVersions });
    }
    res.status(500).json({ error: '服务器内部错误' });
  }
};

// 获取单个版本
export const getVersionById = async (req, res) => {
  try {
    const { id } = req.params;

    // 开发环境模拟响应
    if (process.env.NODE_ENV !== 'production') {
      const mockVersion = {
        id,
        project_id: '1',
        chapter_id: '1',
        content: '这是版本的内容',
        title: '版本标题',
        description: '版本描述',
        created_at: new Date().toISOString()
      };
      return res.status(200).json({ version: mockVersion });
    }

    // 生产环境使用 Supabase
    const { data: version, error } = await supabase
      .from('versions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: '版本不存在' });
      }
      return res.status(500).json({ error: '获取版本时出错' });
    }

    res.status(200).json({ version });
  } catch (error) {
    // 开发环境模拟响应
    if (process.env.NODE_ENV !== 'production') {
      const { id } = req.params;
      const mockVersion = {
        id,
        project_id: '1',
        chapter_id: '1',
        content: '这是版本的内容',
        title: '版本标题',
        description: '版本描述',
        created_at: new Date().toISOString()
      };
      return res.status(200).json({ version: mockVersion });
    }
    res.status(500).json({ error: '服务器内部错误' });
  }
};

// 删除版本
export const deleteVersion = async (req, res) => {
  try {
    const { id } = req.params;

    // 开发环境模拟响应
    if (process.env.NODE_ENV !== 'production') {
      return res.status(200).json({ message: '版本删除成功' });
    }

    // 生产环境使用 Supabase
    const { error } = await supabase
      .from('versions')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({ error: '删除版本时出错' });
    }

    res.status(200).json({ message: '版本删除成功' });
  } catch (error) {
    // 开发环境模拟响应
    if (process.env.NODE_ENV !== 'production') {
      return res.status(200).json({ message: '版本删除成功' });
    }
    res.status(500).json({ error: '服务器内部错误' });
  }
};
