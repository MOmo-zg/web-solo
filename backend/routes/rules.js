const express = require('express');
const router = express.Router();
const rulesController = require('../controllers/rules');

router.get('/', rulesController.getRules);
router.post('/add', rulesController.addRule);
router.put('/update/:id', rulesController.updateRule);
router.delete('/delete/:id', rulesController.deleteRule);

module.exports = router;