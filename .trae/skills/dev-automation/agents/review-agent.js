#!/usr/bin/env node

/**
 * 审查代理
 * 负责检查代码质量和完整性
 */

import fs from 'fs';
import path from 'path';

class ReviewAgent {
  constructor(config = {}) {
    this.config = {
      rules: {
        "code-quality": true,
        "security": true,
        "documentation": true
      },
      ...config
    };
  }

  /**
   * 代码审核
   * @param {string} filePath - 文件路径
   */
  async codeAudit(filePath) {
    console.log(`Review Agent: Auditing code at ${filePath}...`);
    
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error(`File ${filePath} not found`);
      }

      const content = fs.readFileSync(filePath, 'utf8');
      const issues = [];
      
      // 代码质量检查
      if (this.config.rules['code-quality']) {
        const qualityIssues = this.checkCodeQuality(content, filePath);
        issues.push(...qualityIssues);
      }
      
      // 安全检查
      if (this.config.rules.security) {
        const securityIssues = this.checkSecurity(content, filePath);
        issues.push(...securityIssues);
      }
      
      // 文档检查
      if (this.config.rules.documentation) {
        const docIssues = this.checkDocumentation(content, filePath);
        issues.push(...docIssues);
      }
      
      console.log(`Review Agent: Code audit completed. Found ${issues.length} issues.`);
      return { success: issues.length === 0, issues };
    } catch (error) {
      console.error(`Review Agent: Error auditing code: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * 质量检查
   * @param {string} content - 文件内容
   * @param {string} filePath - 文件路径
   */
  async qualityCheck(content, filePath) {
    console.log(`Review Agent: Checking quality at ${filePath}...`);
    
    try {
      const issues = this.checkCodeQuality(content, filePath);
      
      console.log(`Review Agent: Quality check completed. Found ${issues.length} issues.`);
      return { success: issues.length === 0, issues };
    } catch (error) {
      console.error(`Review Agent: Error checking quality: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * 完整性审查
   * @param {string} filePath - 文件路径
   */
  async completenessReview(filePath) {
    console.log(`Review Agent: Reviewing completeness at ${filePath}...`);
    
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error(`File ${filePath} not found`);
      }

      const content = fs.readFileSync(filePath, 'utf8');
      const issues = [];
      
      // 检查文件是否为空
      if (content.trim() === '') {
        issues.push({
          type: 'completeness',
          severity: 'error',
          message: 'File is empty'
        });
      }
      
      // 检查是否有未完成的代码
      if (content.includes('TODO') || content.includes('FIXME') || content.includes('XXX')) {
        issues.push({
          type: 'completeness',
          severity: 'warning',
          message: 'File contains TODO/FIXME/XXX comments'
        });
      }
      
      console.log(`Review Agent: Completeness review completed. Found ${issues.length} issues.`);
      return { success: issues.length === 0, issues };
    } catch (error) {
      console.error(`Review Agent: Error reviewing completeness: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * 检查代码质量
   * @param {string} content - 文件内容
   * @param {string} filePath - 文件路径
   */
  checkCodeQuality(content, filePath) {
    const issues = [];
    
    // 检查代码长度
    const lines = content.split('\n');
    if (lines.length > 500) {
      issues.push({
        type: 'code-quality',
        severity: 'warning',
        message: `File is too long (${lines.length} lines)`
      });
    }
    
    // 检查缩进
    lines.forEach((line, index) => {
      if (line.length > 120) {
        issues.push({
          type: 'code-quality',
          severity: 'warning',
          message: `Line ${index + 1} is too long (${line.length} characters)`
        });
      }
    });
    
    return issues;
  }

  /**
   * 检查安全性
   * @param {string} content - 文件内容
   * @param {string} filePath - 文件路径
   */
  checkSecurity(content, filePath) {
    const issues = [];
    
    // 检查硬编码的密码
    if (content.includes('password') || content.includes('secret') || content.includes('api_key')) {
      issues.push({
        type: 'security',
        severity: 'error',
        message: 'File may contain hard-coded secrets'
      });
    }
    
    return issues;
  }

  /**
   * 检查文档
   * @param {string} content - 文件内容
   * @param {string} filePath - 文件路径
   */
  checkDocumentation(content, filePath) {
    const issues = [];
    
    // 检查是否有注释
    if (!content.includes('//') && !content.includes('/*')) {
      issues.push({
        type: 'documentation',
        severity: 'warning',
        message: 'File has no comments'
      });
    }
    
    return issues;
  }

  /**
   * 运行任务
   * @param {string} task - 任务名称
   * @param {object} params - 任务参数
   */
  async runTask(task, params) {
    switch (task) {
      case 'code-audit':
        return this.codeAudit(params.filePath);
      case 'quality-check':
        return this.qualityCheck(params.content, params.filePath);
      case 'completeness-review':
        return this.completenessReview(params.filePath);
      default:
        throw new Error(`Unknown task: ${task}`);
    }
  }
}

export default ReviewAgent;