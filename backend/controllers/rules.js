const rulesService = require('../services/rules');

const rulesController = {
  getRules: (req, res) => {
    try {
      const rules = rulesService.getRules();
      res.json({ success: true, data: rules });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  addRule: (req, res) => {
    try {
      const rule = req.body;
      const newRule = rulesService.addRule(rule);
      res.json({ success: true, data: newRule });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateRule: (req, res) => {
    try {
      const { id } = req.params;
      const rule = req.body;
      const updatedRule = rulesService.updateRule(id, rule);
      res.json({ success: true, data: updatedRule });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  deleteRule: (req, res) => {
    try {
      const { id } = req.params;
      rulesService.deleteRule(id);
      res.json({ success: true, message: 'Rule deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = rulesController;