const skillsService = require('../services/skills');

const skillsController = {
  getSkills: (req, res) => {
    try {
      const skills = skillsService.getSkills();
      res.json({ success: true, data: skills });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  addSkill: (req, res) => {
    try {
      const skill = req.body;
      const newSkill = skillsService.addSkill(skill);
      res.json({ success: true, data: newSkill });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateSkill: (req, res) => {
    try {
      const { id } = req.params;
      const skill = req.body;
      const updatedSkill = skillsService.updateSkill(id, skill);
      res.json({ success: true, data: updatedSkill });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  deleteSkill: (req, res) => {
    try {
      const { id } = req.params;
      skillsService.deleteSkill(id);
      res.json({ success: true, message: 'Skill deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = skillsController;