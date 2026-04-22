import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// 生成 JWT 令牌
export function generateToken(userId) {
  try {
    const payload = {
      userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 小时过期
    };
    
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key');
    return token;
  } catch (error) {
    console.error('生成令牌时出错:', error);
    throw error;
  }
}

// 验证 JWT 令牌
export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    return decoded;
  } catch (error) {
    console.error('验证令牌时出错:', error);
    throw error;
  }
}

// 从令牌中提取用户 ID
export function getUserIdFromToken(token) {
  try {
    const decoded = verifyToken(token);
    return decoded.userId;
  } catch (error) {
    console.error('从令牌中提取用户 ID 时出错:', error);
    throw error;
  }
}