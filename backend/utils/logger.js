// 日志工具

import fs from 'fs';
import path from 'path';

// 确保日志目录存在
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// 日志文件路径
const errorLogPath = path.join(logDir, 'error.log');
const accessLogPath = path.join(logDir, 'access.log');

// 日志级别
const LOG_LEVELS = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG'
};

// 生成日志时间戳
function getTimestamp() {
  return new Date().toISOString();
}

// 格式化日志消息
function formatLog(level, message, metadata = {}) {
  const timestamp = getTimestamp();
  const logMessage = `${timestamp} [${level}] ${message}`;
  
  if (Object.keys(metadata).length > 0) {
    return `${logMessage} ${JSON.stringify(metadata)}`;
  }
  
  return logMessage;
}

// 写入日志到文件
function writeLogToFile(logPath, message) {
  fs.appendFile(logPath, message + '\n', (err) => {
    if (err) {
      console.error('写入日志文件失败:', err);
    }
  });
}

// 日志记录器
const logger = {
  // 信息日志
  info: (message, metadata = {}) => {
    const logMessage = formatLog(LOG_LEVELS.INFO, message, metadata);
    console.log(logMessage);
    writeLogToFile(accessLogPath, logMessage);
  },
  
  // 警告日志
  warn: (message, metadata = {}) => {
    const logMessage = formatLog(LOG_LEVELS.WARN, message, metadata);
    console.warn(logMessage);
    writeLogToFile(accessLogPath, logMessage);
  },
  
  // 错误日志
  error: (message, metadata = {}) => {
    const logMessage = formatLog(LOG_LEVELS.ERROR, message, metadata);
    console.error(logMessage);
    writeLogToFile(errorLogPath, logMessage);
  },
  
  // 调试日志
  debug: (message, metadata = {}) => {
    if (process.env.NODE_ENV === 'development') {
      const logMessage = formatLog(LOG_LEVELS.DEBUG, message, metadata);
      console.debug(logMessage);
    }
  }
};

// 访问日志中间件
function accessLogMiddleware(req, res, next) {
  const startTime = Date.now();
  const { method, url, ip } = req;
  
  res.on('finish', () => {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    const { statusCode } = res;
    
    logger.info('HTTP Request', {
      method,
      url,
      statusCode,
      responseTime: `${responseTime}ms`,
      ip
    });
  });
  
  next();
}

// 错误处理中间件
function errorHandlerMiddleware(err, req, res, next) {
  const { method, url, ip } = req;
  
  logger.error('Error occurred', {
    method,
    url,
    ip,
    error: err.message,
    stack: err.stack
  });
  
  res.status(500).json({
    error: '服务器内部错误',
    message: process.env.NODE_ENV === 'development' ? err.message : '请稍后再试'
  });
}

// 404 处理中间件
function notFoundMiddleware(req, res, next) {
  const { method, url, ip } = req;
  
  logger.warn('404 Not Found', {
    method,
    url,
    ip
  });
  
  res.status(404).json({
    error: '请求的资源不存在'
  });
}

export { logger, accessLogMiddleware, errorHandlerMiddleware, notFoundMiddleware };