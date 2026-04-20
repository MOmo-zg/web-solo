class RulesService {
  constructor() {
    this.rules = [
      {
        id: 'rule_1',
        name: '保持一致性',
        description: '确保小说中的情节、人物和设定保持一致',
        type: 'consistency',
        priority: 'high'
      },
      {
        id: 'rule_2',
        name: '节奏控制',
        description: '合理控制小说的节奏，避免过于拖沓或仓促',
        type: 'pacing',
        priority: 'medium'
      },
      {
        id: 'rule_3',
        name: '人物发展',
        description: '确保人物有合理的发展和成长弧线',
        type: 'character',
        priority: 'high'
      }
    ];
  }

  getRules() {
    return this.rules;
  }

  getRuleById(id) {
    return this.rules.find(rule => rule.id === id);
  }

  addRule(rule) {
    const newRule = {
      id: `rule_${Date.now()}`,
      ...rule
    };
    this.rules.push(newRule);
    return newRule;
  }

  updateRule(id, updatedRule) {
    const index = this.rules.findIndex(rule => rule.id === id);
    if (index !== -1) {
      this.rules[index] = {
        ...this.rules[index],
        ...updatedRule
      };
      return this.rules[index];
    }
    throw new Error('Rule not found');
  }

  deleteRule(id) {
    const index = this.rules.findIndex(rule => rule.id === id);
    if (index !== -1) {
      this.rules.splice(index, 1);
    } else {
      throw new Error('Rule not found');
    }
  }
}

module.exports = new RulesService();