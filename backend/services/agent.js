const rulesService = require('./rules');
const skillsService = require('./skills');

class AgentService {
  constructor() {
    this.novels = new Map();
    this.status = 'idle';
  }

  async generateNovel({ prompt, genre, characters, setting, rules, skills }) {
    this.status = 'generating';
    
    // 应用规则
    const appliedRules = this.applyRules(rules || []);
    
    // 应用技能
    const appliedSkills = this.applySkills(skills || []);
    
    // 模拟小说生成过程
    const novelId = `novel_${Date.now()}`;
    const novelContent = this.generateNovelContent(prompt, genre, characters, setting, appliedRules, appliedSkills);
    
    const novel = {
      id: novelId,
      prompt,
      genre,
      characters,
      setting,
      content: novelContent,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.novels.set(novelId, novel);
    this.status = 'idle';
    
    return novel;
  }

  async continueNovel({ novelId, prompt, rules, skills }) {
    this.status = 'continuing';
    
    const novel = this.novels.get(novelId);
    if (!novel) {
      throw new Error('Novel not found');
    }
    
    // 应用规则
    const appliedRules = this.applyRules(rules || []);
    
    // 应用技能
    const appliedSkills = this.applySkills(skills || []);
    
    // 模拟小说续写过程
    const continuation = this.generateContinuation(novel, prompt, appliedRules, appliedSkills);
    novel.content += '\n' + continuation;
    novel.updatedAt = new Date();
    
    this.status = 'idle';
    return novel;
  }

  getStatus() {
    return {
      status: this.status,
      activeNovels: this.novels.size
    };
  }

  applyRules(rules) {
    return rules.map(ruleId => {
      const rule = rulesService.getRuleById(ruleId);
      return rule ? rule : null;
    }).filter(Boolean);
  }

  applySkills(skills) {
    return skills.map(skillId => {
      const skill = skillsService.getSkillById(skillId);
      return skill ? skill : null;
    }).filter(Boolean);
  }

  generateNovelContent(prompt, genre, characters, setting, rules, skills) {
    // 模拟小说生成，实际项目中会调用AI模型
    return `# ${prompt}\n\n**Genre:** ${genre}\n**Setting:** ${setting}\n\n**Characters:**\n${characters.map(char => `- ${char.name}: ${char.description}`).join('\n')}\n\n**Chapter 1**\n\n${prompt} 故事开始了...\n\n这是一个${genre}类型的小说，发生在${setting}。\n\n${characters[0].name}是一个${characters[0].description}，他/她开始了一段奇妙的旅程。\n\n（规则应用：${rules.map(rule => rule.name).join(', ')}）\n（技能应用：${skills.map(skill => skill.name).join(', ')}）`;
  }

  generateContinuation(novel, prompt, rules, skills) {
    // 模拟小说续写，实际项目中会调用AI模型
    return `**Chapter 2**\n\n${prompt}\n\n故事继续发展...\n\n（规则应用：${rules.map(rule => rule.name).join(', ')}）\n（技能应用：${skills.map(skill => skill.name).join(', ')}）`;
  }
}

module.exports = new AgentService();