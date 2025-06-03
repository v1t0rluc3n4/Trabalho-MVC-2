const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Rotas para páginas (views)
router.get('/', taskController.index);
router.get('/create', taskController.create);
router.post('/', taskController.store);
router.get('/:id/edit', taskController.edit);
router.put('/:id', taskController.update);
router.delete('/:id', taskController.destroy);

// Rotas da API para integração via fetch
router.get('/api', taskController.apiIndex);
router.post('/api', taskController.apiStore);
router.put('/api/:id', taskController.apiUpdate);
router.delete('/api/:id', taskController.apiDestroy);

module.exports = router;