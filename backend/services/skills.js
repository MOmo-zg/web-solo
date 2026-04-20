class SkillsService {
  constructor() {
    this.skills = [
      {
        id: 'skill_1',
        name: '描述能力',
        description: '增强对场景和人物的描述能力',
        type: 'description',
        level: 'advanced'
      },
      {
        id: 'skill_2',
        name: '对话写作',
        description: '提升对话的真实性和生动性',
        type: 'dialogue',
        level: 'intermediate'
      },
      {
        id: 'skill_3',
        name: '情节构建',
        description: '帮助构建引人入胜的情节',
        type: 'plot',
        level: 'advanced'
      },
      {
        id: 'skill_4',
        name: '世界构建',
        description: '增强对小说世界的构建能力',
        type: 'worldbuilding',
        level: 'advanced'
      }
    ];
  }

  getSkills() {
    return this.skills;
  }

  getSkillById(id) {
    return this.skills.find(skill => skill.id === id);
  }

  addSkill(skill) {
    const newSkill = {
      id: `skill_${Date.now()}`,
      ...skill
    };
    this.skills.push(newSkill);
    return newSkill;
  }

  updateSkill(id, updatedSkill) {
    const index = this.skills.findIndex(skill => skill.id === id);
    if (index !== -1) {
      this.skills[index] = {
        ...this.skills[index],
        ...updatedSkill
      };
      return this.skills[index];
    }
    throw new Error('Skill not found');
  }

  deleteSkill(id) {
    const index = this.skills.findIndex(skill => skill.id === id);
    if (index !== -1) {
      this.skills.splice(index, 1);
    } else {
      throw new Error('Skill not found');
    }
  }
}

module.exports = new SkillsService();