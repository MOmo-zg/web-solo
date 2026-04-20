#!/usr/bin/env node

/**
 * 测试代理
 * 负责测试开发的功能是否符合预期
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

class TestAgent {
  constructor(config = {}) {
    this.config = {
      test_dir: "tests",
      test_pattern: "**/*.test.js",
      ...config
    };
  }

  /**
   * 运行测试
   * @param {string} testPath - 测试路径
   */
  async runTests(testPath) {
    console.log(`Test Agent: Running tests at ${testPath}...`);
    
    try {
      if (!fs.existsSync(testPath)) {
        throw new Error(`Test path ${testPath} not found`);
      }

      // 检查是否是文件还是目录
      const stats = fs.statSync(testPath);
      let testCommand = '';

      if (stats.isDirectory()) {
        // 运行目录下的所有测试
        testCommand = `npm test -- ${testPath}`;
      } else {
        // 运行指定文件的测试
        testCommand = `npm test -- ${testPath}`;
      }

      // 执行测试
      const output = execSync(testCommand, { encoding: 'utf8' });
      console.log(`Test Agent: Test output:`);
      console.log(output);

      // 检查测试是否通过
      const passed = !output.includes('failed') && !output.includes('error');
      
      console.log(`Test Agent: Tests ${passed ? 'passed' : 'failed'}!`);
      return { success: passed, output };
    } catch (error) {
      console.error(`Test Agent: Error running tests: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * 生成测试文件
   * @param {string} sourceFile - 源文件路径
   * @param {string} testFile - 测试文件路径
   */
  async generateTest(sourceFile, testFile) {
    console.log(`Test Agent: Generating test for ${sourceFile}...`);
    
    try {
      if (!fs.existsSync(sourceFile)) {
        throw new Error(`Source file ${sourceFile} not found`);
      }

      // 读取源文件内容
      const sourceContent = fs.readFileSync(sourceFile, 'utf8');
      
      // 生成测试代码
      const testCode = this.generateTestCode(sourceContent, sourceFile);
      
      // 确保测试目录存在
      const testDir = path.dirname(testFile);
      if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir, { recursive: true });
      }
      
      // 写入测试文件
      fs.writeFileSync(testFile, testCode);
      
      console.log(`Test Agent: Test generated successfully at ${testFile}`);
      return { success: true, path: testFile };
    } catch (error) {
      console.error(`Test Agent: Error generating test: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * 运行端到端测试
   * @param {string} testPath - 测试路径
   */
  async runE2ETests(testPath) {
    console.log(`Test Agent: Running end-to-end tests at ${testPath}...`);
    
    try {
      if (!fs.existsSync(testPath)) {
        throw new Error(`Test path ${testPath} not found`);
      }

      // 执行端到端测试
      const output = execSync(`npm run test:e2e -- ${testPath}`, { encoding: 'utf8' });
      console.log(`Test Agent: E2E test output:`);
      console.log(output);

      // 检查测试是否通过
      const passed = !output.includes('failed') && !output.includes('error');
      
      console.log(`Test Agent: E2E tests ${passed ? 'passed' : 'failed'}!`);
      return { success: passed, output };
    } catch (error) {
      console.error(`Test Agent: Error running E2E tests: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * 生成测试代码
   * @param {string} sourceContent - 源文件内容
   * @param {string} sourceFile - 源文件路径
   * @returns {string} 测试代码
   */
  generateTestCode(sourceContent, sourceFile) {
    // 这里可以实现测试代码生成逻辑
    // 例如：分析源文件，生成相应的测试用例
    const fileName = path.basename(sourceFile);
    const testCode = `/**
 * Test for ${fileName}
 */

import { describe, it, expect } from 'vitest';

// Import the module to test
import * as module from '${sourceFile.replace(/\.js$|\.ts$/, '')}';

describe('${fileName}', () => {
  // Test cases will be generated here
  it('should work correctly', () => {
    expect(true).toBe(true);
  });
});
`;

    return testCode;
  }

  /**
   * 运行任务
   * @param {string} task - 任务名称
   * @param {object} params - 任务参数
   */
  async runTask(task, params) {
    switch (task) {
      case 'run-tests':
        return this.runTests(params.testPath);
      case 'generate-test':
        return this.generateTest(params.sourceFile, params.testFile);
      case 'run-e2e-tests':
        return this.runE2ETests(params.testPath);
      default:
        throw new Error(`Unknown task: ${task}`);
    }
  }
}

export default TestAgent;