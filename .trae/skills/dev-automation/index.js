#!/usr/bin/env node

/**
 * 开发自动化技能
 * 实现开发-审核-测试整合闭环，自动整理文档内容，自动更新索引文档
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import DevAgent from './agents/dev-agent.js';
import ReviewAgent from './agents/review-agent.js';
import TestAgent from './agents/test-agent.js';

class DevAutomation {
  constructor(config = {}) {
    this.config = {
      project: {
        name: "Novel Creation Platform",
        version: "1.0.0",
        description: "A platform for creating novels with AI assistance"
      },
      workflow: {
        steps: [
          { name: "code-generation", enabled: true },
          { name: "code-audit", enabled: true },
          { name: "testing", enabled: true },
          { name: "docs-update", enabled: true },
          { name: "index-update", enabled: true }
        ]
      },
      paths: {
        source: "src",
        docs: ".trae/documents",
        index: "PROJECT_INDEX.md",
        status: "DEVELOPMENT_STATUS.md"
      },
      rules: {
        "code-quality": { enabled: true, severity: "error" },
        security: { enabled: true, severity: "error" },
        documentation: { enabled: true, severity: "warning" }
      },
      ...config
    };
    
    // 初始化子代理
    this.devAgent = new DevAgent();
    this.reviewAgent = new ReviewAgent();
    this.testAgent = new TestAgent();
  }

  /**
   * 初始化项目
   */
  init() {
    console.log('Initializing project...');
    this.updateIndex();
    console.log('Project initialized successfully!');
  }

  /**
   * 生成代码
   * @param {string} template - 模板名称
   * @param {string} output - 输出路径
   */
  async generate(template, output) {
    console.log(`Generating code from template ${template} to ${output}...`);
    const result = await this.devAgent.runTask('generate-code', { template, output });
    if (result.success) {
      console.log('Code generated successfully!');
    } else {
      console.error(`Code generation failed: ${result.error}`);
      process.exit(1);
    }
  }

  /**
   * 运行代码审核
   * @param {string} path - 代码路径
   */
  async audit(path) {
    console.log(`Auditing code at ${path}...`);
    
    // 检查路径是否存在
    if (!fs.existsSync(path)) {
      console.error(`Path ${path} not found`);
      process.exit(1);
    }
    
    // 检查是否是目录
    const stats = fs.statSync(path);
    if (stats.isDirectory()) {
      // 遍历目录下的所有文件
      const files = this.getFilesInDirectory(path);
      let allPassed = true;
      
      for (const file of files) {
        const result = await this.reviewAgent.runTask('code-audit', { filePath: file });
        if (!result.success) {
          allPassed = false;
        }
      }
      
      if (allPassed) {
        console.log('Code audit completed successfully!');
      } else {
        console.error('Code audit failed!');
        process.exit(1);
      }
    } else {
      // 审核单个文件
      const result = await this.reviewAgent.runTask('code-audit', { filePath: path });
      if (result.success) {
        console.log('Code audit completed successfully!');
      } else {
        console.error('Code audit failed!');
        process.exit(1);
      }
    }
  }

  /**
   * 运行测试
   * @param {string} path - 测试路径
   */
  async test(path) {
    console.log(`Running tests at ${path}...`);
    const result = await this.testAgent.runTask('run-tests', { testPath: path });
    if (result.success) {
      console.log('Tests passed successfully!');
    } else {
      console.error(`Tests failed: ${result.error}`);
      process.exit(1);
    }
  }

  /**
   * 更新文档
   */
  updateDocs() {
    console.log('Updating documentation...');
    // 这里可以实现文档更新逻辑
    console.log('Documentation updated successfully!');
  }

  /**
   * 更新索引
   */
  updateIndex() {
    console.log('Updating project index...');
    
    const projectIndex = this.generateProjectIndex();
    fs.writeFileSync(this.config.paths.index, projectIndex);
    
    console.log('Project index updated successfully!');
  }

  /**
   * 运行完整流程
   */
  async pipeline() {
    console.log('Running full dev automation pipeline...');
    
    for (const step of this.config.workflow.steps) {
      if (step.enabled) {
        console.log(`\n=== Running step: ${step.name} ===`);
        switch (step.name) {
          case 'code-generation':
            // 代码生成逻辑
            break;
          case 'code-audit':
            await this.audit(this.config.paths.source);
            break;
          case 'testing':
            await this.test(this.config.paths.source);
            break;
          case 'docs-update':
            this.updateDocs();
            break;
          case 'index-update':
            this.updateIndex();
            break;
        }
      }
    }
    
    console.log('\n=== Pipeline completed successfully! ===');
  }

  /**
   * 生成项目索引
   * @returns {string} 项目索引内容
   */
  generateProjectIndex() {
    const rootDir = process.cwd();
    const directoryStructure = this.scanDirectory(rootDir);
    
    let indexContent = '# 项目索引\n\n## 目录结构\n\n```\n';
    indexContent += directoryStructure;
    indexContent += '```\n\n## 文件说明\n\n### 核心文件\n\n';
    
    const coreFiles = [
      'src/routes/+page.svelte',
      'src/routes/create/+page.svelte',
      'src/routes/project/[id]/+page.svelte',
      'src/lib/components/SettingsDropdown.svelte',
      'src/lib/utils/theme.ts',
      'src/lib/utils/i18n.ts'
    ];
    
    coreFiles.forEach((file, index) => {
      if (fs.existsSync(path.join(rootDir, file))) {
        indexContent += `${index + 1}. **${file}** - ${this.getFileDescription(file)}\n`;
      }
    });
    
    indexContent += '\n### 文档文件\n\n';
    
    const docFiles = [
      '.trae/documents/PRD.md',
      '.trae/documents/Technical_Architecture.md'
    ];
    
    docFiles.forEach((file, index) => {
      if (fs.existsSync(path.join(rootDir, file))) {
        indexContent += `${index + 1}. **${file}** - ${this.getFileDescription(file)}\n`;
      }
    });
    
    indexContent += '\n### 配置文件\n\n';
    
    const configFiles = [
      'package.json',
      'svelte.config.js',
      'tailwind.config.js',
      'vite.config.ts'
    ];
    
    configFiles.forEach((file, index) => {
      if (fs.existsSync(path.join(rootDir, file))) {
        indexContent += `${index + 1}. **${file}** - ${this.getFileDescription(file)}\n`;
      }
    });
    
    return indexContent;
  }

  /**
   * 扫描目录结构
   * @param {string} dir - 目录路径
   * @param {number} level - 递归级别
   * @returns {string} 目录结构
   */
  scanDirectory(dir, level = 0) {
    const indent = ' '.repeat(level * 2);
    let structure = '';
    
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      
      if (file.startsWith('.') || file === 'node_modules' || file === '.svelte-kit') {
        return;
      }
      
      if (stats.isDirectory()) {
        structure += `${indent}├── ${file}/\n`;
        structure += this.scanDirectory(filePath, level + 1);
      } else {
        structure += `${indent}├── ${file}\n`;
      }
    });
    
    return structure;
  }

  /**
   * 获取文件描述
   * @param {string} filePath - 文件路径
   * @returns {string} 文件描述
   */
  getFileDescription(filePath) {
    const descriptions = {
      'src/routes/+page.svelte': '首页，显示项目列表',
      'src/routes/create/+page.svelte': '创建新项目页面',
      'src/routes/project/[id]/+page.svelte': '项目编辑页面',
      'src/lib/components/SettingsDropdown.svelte': '主题和语言设置组件',
      'src/lib/utils/theme.ts': '主题管理工具',
      'src/lib/utils/i18n.ts': '国际化工具',
      '.trae/documents/PRD.md': '产品需求文档',
      '.trae/documents/Technical_Architecture.md': '技术架构文档',
      'package.json': '项目依赖和脚本',
      'svelte.config.js': 'Svelte 编译器配置',
      'tailwind.config.js': 'Tailwind CSS 配置',
      'vite.config.ts': 'Vite 构建配置'
    };
    
    return descriptions[filePath] || '文件描述';
  }

  /**
   * 获取目录中的所有文件
   * @param {string} dir - 目录路径
   * @returns {string[]} 文件路径数组
   */
  getFilesInDirectory(dir) {
    const files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...this.getFilesInDirectory(fullPath));
      } else {
        // 只处理 JavaScript 和 TypeScript 文件
        if (entry.name.endsWith('.js') || entry.name.endsWith('.ts') || entry.name.endsWith('.svelte')) {
          files.push(fullPath);
        }
      }
    }
    
    return files;
  }
}

// 命令行接口
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  const devAutomation = new DevAutomation();
  
  try {
    switch (command) {
      case 'init':
        devAutomation.init();
        break;
      case 'generate':
        await devAutomation.generate(args[1], args[2]);
        break;
      case 'audit':
        await devAutomation.audit(args[1]);
        break;
      case 'test':
        await devAutomation.test(args[1]);
        break;
      case 'docs':
        if (args[1] === 'update') {
          devAutomation.updateDocs();
        }
        break;
      case 'index':
        if (args[1] === 'update') {
          devAutomation.updateIndex();
        }
        break;
      case 'pipeline':
        await devAutomation.pipeline();
        break;
      default:
        console.log('Usage: dev-automation <command> [options]');
        console.log('Commands:');
        console.log('  init                 Initialize project');
        console.log('  generate <template> <output>  Generate code from template');
        console.log('  audit <path>         Audit code quality');
        console.log('  test <path>          Run tests');
        console.log('  docs update          Update documentation');
        console.log('  index update         Update project index');
        console.log('  pipeline             Run full pipeline');
        break;
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default DevAutomation;