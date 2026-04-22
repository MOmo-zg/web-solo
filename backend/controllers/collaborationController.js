import supabase from '../utils/supabase.js';

// 获取项目成员列表
export const getProjectMembers = async (req, res) => {
  try {
    const { projectId } = req.params;

    // 开发环境模拟响应
    if (process.env.NODE_ENV !== 'production') {
      const mockMembers = [
        {
          id: '1',
          user_id: '1',
          project_id: projectId,
          role: 'owner',
          user: {
            id: '1',
            username: '测试用户',
            email: 'test@example.com'
          },
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          user_id: '2',
          project_id: projectId,
          role: 'editor',
          user: {
            id: '2',
            username: '协作用户',
            email: 'collab@example.com'
          },
          created_at: new Date().toISOString()
        }
      ];
      return res.status(200).json({ members: mockMembers });
    }

    // 生产环境使用 Supabase
    const { data: members, error } = await supabase
      .from('project_members')
      .select(`
        id,
        user_id,
        project_id,
        role,
        created_at,
        user (id, username, email)
      `)
      .eq('project_id', projectId);

    if (error) {
      return res.status(500).json({ error: '获取项目成员失败' });
    }

    res.status(200).json({ members });
  } catch (error) {
    // 开发环境模拟响应
    if (process.env.NODE_ENV !== 'production') {
      const { projectId } = req.params;
      const mockMembers = [
        {
          id: '1',
          user_id: '1',
          project_id: projectId,
          role: 'owner',
          user: {
            id: '1',
            username: '测试用户',
            email: 'test@example.com'
          },
          created_at: new Date().toISOString()
        }
      ];
      return res.status(200).json({ members: mockMembers });
    }
    res.status(500).json({ error: '服务器内部错误' });
  }
};

// 邀请项目成员
export const inviteProjectMember = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { email, role } = req.body;

    // 验证输入
    if (!email || !role) {
      return res.status(400).json({ error: '请填写邮箱和角色' });
    }

    // 开发环境模拟响应
    if (process.env.NODE_ENV !== 'production') {
      const mockMember = {
        id: Date.now().toString(),
        user_id: Date.now().toString(),
        project_id: projectId,
        role,
        user: {
          id: Date.now().toString(),
          username: email.split('@')[0],
          email
        },
        created_at: new Date().toISOString()
      };
      return res.status(201).json({ member: mockMember });
    }

    // 生产环境使用 Supabase
    // 先查找用户
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, username, email')
      .eq('email', email)
      .single();

    if (userError) {
      return res.status(404).json({ error: '用户不存在' });
    }

    // 检查用户是否已经是项目成员
    const { data: existingMember, error: existingError } = await supabase
      .from('project_members')
      .select('id')
      .eq('project_id', projectId)
      .eq('user_id', user.id)
      .single();

    if (existingMember) {
      return res.status(400).json({ error: '用户已经是项目成员' });
    }

    // 添加项目成员
    const { data: member, error: memberError } = await supabase
      .from('project_members')
      .insert({
        project_id: projectId,
        user_id: user.id,
        role,
        created_at: new Date().toISOString()
      })
      .select(`
        id,
        user_id,
        project_id,
        role,
        created_at,
        user (id, username, email)
      `)
      .single();

    if (memberError) {
      return res.status(500).json({ error: '添加项目成员失败' });
    }

    res.status(201).json({ member });
  } catch (error) {
    // 开发环境模拟响应
    if (process.env.NODE_ENV !== 'production') {
      const { projectId } = req.params;
      const { email, role } = req.body;
      const mockMember = {
        id: Date.now().toString(),
        user_id: Date.now().toString(),
        project_id: projectId,
        role,
        user: {
          id: Date.now().toString(),
          username: email.split('@')[0],
          email
        },
        created_at: new Date().toISOString()
      };
      return res.status(201).json({ member: mockMember });
    }
    res.status(500).json({ error: '服务器内部错误' });
  }
};

// 更新成员角色
export const updateMemberRole = async (req, res) => {
  try {
    const { projectId, memberId } = req.params;
    const { role } = req.body;

    // 验证输入
    if (!role) {
      return res.status(400).json({ error: '请填写角色' });
    }

    // 开发环境模拟响应
    if (process.env.NODE_ENV !== 'production') {
      const mockMember = {
        id: memberId,
        user_id: '2',
        project_id: projectId,
        role,
        user: {
          id: '2',
          username: '协作用户',
          email: 'collab@example.com'
        },
        created_at: new Date().toISOString()
      };
      return res.status(200).json({ member: mockMember });
    }

    // 生产环境使用 Supabase
    const { data: member, error } = await supabase
      .from('project_members')
      .update({ role })
      .eq('id', memberId)
      .eq('project_id', projectId)
      .select(`
        id,
        user_id,
        project_id,
        role,
        created_at,
        user (id, username, email)
      `)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: '成员不存在' });
      }
      return res.status(500).json({ error: '更新成员角色失败' });
    }

    res.status(200).json({ member });
  } catch (error) {
    // 开发环境模拟响应
    if (process.env.NODE_ENV !== 'production') {
      const { projectId, memberId } = req.params;
      const { role } = req.body;
      const mockMember = {
        id: memberId,
        user_id: '2',
        project_id: projectId,
        role,
        user: {
          id: '2',
          username: '协作用户',
          email: 'collab@example.com'
        },
        created_at: new Date().toISOString()
      };
      return res.status(200).json({ member: mockMember });
    }
    res.status(500).json({ error: '服务器内部错误' });
  }
};

// 移除项目成员
export const removeProjectMember = async (req, res) => {
  try {
    const { projectId, memberId } = req.params;

    // 开发环境模拟响应
    if (process.env.NODE_ENV !== 'production') {
      return res.status(200).json({ message: '成员移除成功' });
    }

    // 生产环境使用 Supabase
    const { error } = await supabase
      .from('project_members')
      .delete()
      .eq('id', memberId)
      .eq('project_id', projectId);

    if (error) {
      return res.status(500).json({ error: '移除成员失败' });
    }

    res.status(200).json({ message: '成员移除成功' });
  } catch (error) {
    // 开发环境模拟响应
    if (process.env.NODE_ENV !== 'production') {
      return res.status(200).json({ message: '成员移除成功' });
    }
    res.status(500).json({ error: '服务器内部错误' });
  }
};
