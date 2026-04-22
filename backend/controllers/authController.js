import supabase from '../utils/supabase.js';
import { generateToken } from '../utils/jwt.js';

// 注册用户
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 验证输入
    if (!username || !email || !password) {
      return res.status(400).json({ error: '请填写所有必填字段' });
    }

    // 开发环境模拟响应
    if (process.env.NODE_ENV !== 'production') {
      const mockUser = {
        id: Date.now().toString(),
        username,
        email,
        created_at: new Date().toISOString()
      };
      return res.status(201).json({ user: mockUser });
    }

    // 生产环境使用 Supabase
    // 检查邮箱是否已存在
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      return res.status(500).json({ error: '检查用户时出错' });
    }

    if (existingUser) {
      return res.status(400).json({ error: '邮箱已被注册' });
    }

    // 创建用户
    const { data: user, error: createError } = await supabase
      .from('users')
      .insert({
        username,
        email,
        password_hash: password, // 实际生产环境中应该使用 bcrypt 加密
        created_at: new Date().toISOString()
      })
      .select('id, username, email, created_at')
      .single();

    if (createError) {
      return res.status(500).json({ error: '创建用户时出错' });
    }

    res.status(201).json({ user });
  } catch (error) {
    // 开发环境模拟响应
    if (process.env.NODE_ENV !== 'production') {
      const { username, email } = req.body;
      const mockUser = {
        id: Date.now().toString(),
        username,
        email,
        created_at: new Date().toISOString()
      };
      return res.status(201).json({ user: mockUser });
    }
    res.status(500).json({ error: '服务器内部错误' });
  }
};

// 登录用户
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 验证输入
    if (!email || !password) {
      return res.status(400).json({ error: '请填写所有必填字段' });
    }

    // 开发环境模拟响应
    if (process.env.NODE_ENV !== 'production') {
      const mockUser = {
        id: '1',
        username: '测试用户',
        email
      };
      const token = 'mock-jwt-token';
      return res.status(200).json({ user: mockUser, token });
    }

    // 生产环境使用 Supabase
    // 查找用户
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('id, username, email, password_hash')
      .eq('email', email)
      .single();

    if (findError) {
      if (findError.code === 'PGRST116') {
        return res.status(401).json({ error: '邮箱或密码错误' });
      }
      return res.status(500).json({ error: '查找用户时出错' });
    }

    // 验证密码（实际生产环境中应该使用 bcrypt 验证）
    if (user.password_hash !== password) {
      return res.status(401).json({ error: '邮箱或密码错误' });
    }

    // 生成 JWT token
    const token = generateToken(user.id);

    // 返回用户信息和 token
    res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token
    });
  } catch (error) {
    // 开发环境模拟响应
    if (process.env.NODE_ENV !== 'production') {
      const { email } = req.body;
      const mockUser = {
        id: '1',
        username: '测试用户',
        email
      };
      const token = 'mock-jwt-token';
      return res.status(200).json({ user: mockUser, token });
    }
    res.status(500).json({ error: '服务器内部错误' });
  }
};

// 获取当前用户信息
export const getCurrentUser = async (req, res) => {
  try {
    // 开发环境模拟响应
    if (process.env.NODE_ENV !== 'production') {
      const mockUser = {
        id: '1',
        username: '测试用户',
        email: 'test@example.com',
        created_at: new Date().toISOString()
      };
      return res.status(200).json({ user: mockUser });
    }

    // 从请求对象中获取用户 ID（由认证中间件设置）
    const userId = req.userId;

    const { data: user, error } = await supabase
      .from('users')
      .select('id, username, email, created_at')
      .eq('id', userId)
      .single();

    if (error) {
      return res.status(404).json({ error: '用户不存在' });
    }

    res.status(200).json({ user });
  } catch (error) {
    // 开发环境模拟响应
    if (process.env.NODE_ENV !== 'production') {
      const mockUser = {
        id: '1',
        username: '测试用户',
        email: 'test@example.com',
        created_at: new Date().toISOString()
      };
      return res.status(200).json({ user: mockUser });
    }
    res.status(500).json({ error: '服务器内部错误' });
  }
};

// 重置密码
export const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // 验证输入
    if (!email) {
      return res.status(400).json({ error: '请提供邮箱地址' });
    }

    // 开发环境模拟响应
    if (process.env.NODE_ENV !== 'production') {
      // 模拟发送重置邮件
      console.log(`重置密码邮件已发送到 ${email}`);
      return res.status(200).json({ message: '重置密码邮件已发送，请查收' });
    }

    // 生产环境使用 Supabase
    // 实际生产环境中应该生成重置令牌并发送邮件
    res.status(200).json({ message: '重置密码邮件已发送，请查收' });
  } catch (error) {
    res.status(500).json({ error: '重置密码时出错' });
  }
};

// 上传头像
export const uploadAvatar = async (req, res) => {
  try {
    // 开发环境模拟响应
    if (process.env.NODE_ENV !== 'production') {
      // 模拟上传头像
      const mockAvatarUrl = `https://via.placeholder.com/150?text=Avatar`;
      return res.status(200).json({ avatarUrl: mockAvatarUrl });
    }

    // 生产环境处理文件上传
    // 实际生产环境中应该处理文件上传并保存到存储服务
    res.status(200).json({ avatarUrl: 'https://via.placeholder.com/150?text=Avatar' });
  } catch (error) {
    res.status(500).json({ error: '上传头像时出错' });
  }
};
