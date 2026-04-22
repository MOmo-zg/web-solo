import { verifyToken } from '../utils/jwt.js';

// 认证中间件
export function authMiddleware(req, res, next) {
  try {
    // 从请求头中获取令牌
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: '未提供认证令牌' });
    }
    
    // 提取令牌
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: '未提供认证令牌' });
    }
    
    // 开发环境中允许使用 mock-jwt-token
    if (process.env.NODE_ENV !== 'production' && token === 'mock-jwt-token') {
      // 设置默认用户 ID
      req.userId = '1';
      next();
      return;
    }
    
    // 验证令牌
    const decoded = verifyToken(token);
    
    // 将用户 ID 添加到请求对象中
    req.userId = decoded.userId;
    
    next();
  } catch (error) {
    return res.status(401).json({ error: '无效的认证令牌' });
  }
}