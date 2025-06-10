const express = require('express');
const TaskController = require('../controllers/taskController');
const router = express.Router();

router.get('/', TaskController.index);
router.get('/create', TaskController.showCreate);
router.post('/create', TaskController.create);
router.get('/edit/:id', TaskController.showEdit);
router.post('/edit/:id', TaskController.update);
router.get('/delete/:id', TaskController.delete);

module.exports = router;