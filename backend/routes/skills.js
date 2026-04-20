const express = require('express');
const router = express.Router();
const skillsController = require('../controllers/skills');

router.get('/', skillsController.getSkills);
router.post('/add', skillsController.addSkill);
router.put('/update/:id', skillsController.updateSkill);
router.delete('/delete/:id', skillsController.deleteSkill);

module.exports = router;