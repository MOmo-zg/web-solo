import supabase from '../utils/supabase.js';

// 更新用户资料
export const updateProfile = async (req, res) => {
  try {
    const { username, email, avatar } = req.body;
    // 实际生产环境中应该从 JWT token 中获取用户 ID
    const userId = '1'; // 模拟用户 ID

    // 验证输入
    if (!username) {
      return res.status(400).json({ error: '请填写用户名' });
    }

    // 开发环境模拟响应
    if (process.env.NODE_ENV !== 'production') {
      const mockUser = {
        id: userId,
        username,
        email: email || 'test@example.com',
        avatar,
        created_at: new Date().toISOString()
      };
      return res.status(200).json({ user: mockUser });
    }

    // 生产环境使用 Supabase
    const { data: user, error } = await supabase
      .from('users')
      .update({
        username,
        email,
        avatar
      })
      .eq('id', userId)
      .select('id, username, email, avatar, created_at')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: '用户不存在' });
      }
      return res.status(500).json({ error: '更新用户资料时出错' });
    }

    res.status(200).json({ user });
  } catch (error) {
    // 开发环境模拟响应
    if (process.env.NODE_ENV !== 'production') {
      const { username, email, avatar } = req.body;
      const userId = '1'; // 模拟用户 ID
      const mockUser = {
        id: userId,
        username,
        email: email || 'test@example.com',
        avatar,
        created_at: new Date().toISOString()
      };
      return res.status(200).json({ user: mockUser });
    }
    res.status(500).json({ error: '服务器内部错误' });
  }
};

// 获取用户资料
export const getProfile = async (req, res) => {
  try {
    // 实际生产环境中应该从 JWT token 中获取用户 ID
    const userId = '1'; // 模拟用户 ID

    // 开发环境模拟响应
    if (process.env.NODE_ENV !== 'production') {
      const mockUser = {
        id: userId,
        username: '测试用户',
        email: 'test@example.com',
        avatar: '',
        created_at: new Date().toISOString()
      };
      return res.status(200).json({ user: mockUser });
    }

    // 生产环境使用 Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('id, username, email, avatar, created_at')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: '用户不存在' });
      }
      return res.status(500).json({ error: '获取用户资料时出错' });
    }

    res.status(200).json({ user });
  } catch (error) {
    // 开发环境模拟响应
    if (process.env.NODE_ENV !== 'production') {
      const userId = '1'; // 模拟用户 ID
      const mockUser = {
        id: userId,
        username: '测试用户',
        email: 'test@example.com',
        avatar: '',
        created_at: new Date().toISOString()
      };
      return res.status(200).json({ user: mockUser });
    }
    res.status(500).json({ error: '服务器内部错误' });
  }
};

// 修改密码
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    // 实际生产环境中应该从 JWT token 中获取用户 ID
    const userId = '1'; // 模拟用户 ID

    // 验证输入
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: '请填写旧密码和新密码' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: '新密码长度至少为6位' });
    }

    // 开发环境模拟响应
    if (process.env.NODE_ENV !== 'production') {
      return res.status(200).json({ message: '密码修改成功' });
    }

    // 生产环境使用 Supabase
    // 首先验证旧密码
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('password_hash')
      .eq('id', userId)
      .single();

    if (findError) {
      if (findError.code === 'PGRST116') {
        return res.status(404).json({ error: '用户不存在' });
      }
      return res.status(500).json({ error: '查找用户时出错' });
    }

    // 验证旧密码（实际生产环境中应该使用 bcrypt 验证）
    if (user.password_hash !== oldPassword) {
      return res.status(401).json({ error: '旧密码错误' });
    }

    // 更新密码
    const { error: updateError } = await supabase
      .from('users')
      .update({
        password_hash: newPassword // 实际生产环境中应该使用 bcrypt 加密
      })
      .eq('id', userId);

    if (updateError) {
      return res.status(500).json({ error: '修改密码时出错' });
    }

    res.status(200).json({ message: '密码修改成功' });
  } catch (error) {
    // 开发环境模拟响应
    if (process.env.NODE_ENV !== 'production') {
      return res.status(200).json({ message: '密码修改成功' });
    }
    res.status(500).json({ error: '服务器内部错误' });
  }
};
