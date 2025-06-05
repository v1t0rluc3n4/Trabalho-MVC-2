const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validation');
const taskController = require('../../controllers/TaskController');
const { taskSchema } = require('../../utils/validationSchemas');

router.use(auth.authenticate);

router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', validate(taskSchema), taskController.createTask);
router.put('/:id', validate(taskSchema), taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;