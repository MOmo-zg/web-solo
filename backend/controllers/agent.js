const agentService = require('../services/agent');

const agentController = {
  generateNovel: async (req, res) => {
    try {
      const { prompt, genre, characters, setting, rules, skills } = req.body;
      const result = await agentService.generateNovel({
        prompt,
        genre,
        characters,
        setting,
        rules,
        skills
      });
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  continueNovel: async (req, res) => {
    try {
      const { novelId, prompt, rules, skills } = req.body;
      const result = await agentService.continueNovel({
        novelId,
        prompt,
        rules,
        skills
      });
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getStatus: (req, res) => {
    try {
      const status = agentService.getStatus();
      res.json({ success: true, data: status });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = agentController;