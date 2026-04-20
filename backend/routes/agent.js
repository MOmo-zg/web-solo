const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agent');

router.post('/generate', agentController.generateNovel);
router.post('/continue', agentController.continueNovel);
router.get('/status', agentController.getStatus);

module.exports = router;