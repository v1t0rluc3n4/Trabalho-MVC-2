const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const TaskController = require('../../controllers/TaskController');
const Task = require('../../models/Task');
const ApiError = require('../../utils/ApiError');
const httpStatus = require('http-status');

router.use(auth.authenticate);

router.get('/', TaskController.getAllTasks);
router.get('/create', (req, res) => res.render('tasks/create', { title: 'Create Task' }));
router.get('/:id', TaskController.getTaskById);
router.get('/:id/edit', async (req, res, next) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!task) throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
    res.render('tasks/edit', { title: 'Edit Task', task });
  } catch (error) {
    next(error);
  }
});
router.post('/', TaskController.createTask);
router.put('/:id', TaskController.updateTask);
router.delete('/:id', TaskController.deleteTask);

module.exports = router;