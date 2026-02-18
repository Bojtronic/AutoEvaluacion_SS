const { Router } = require('express');
const controller = require('../controllers/topics_controller');

const router = Router();

/* =========================================
   GET ALL TOPICS
   GET /api/topics
========================================= */
router.get('/', controller.get);

/* =========================================
   GET TOPIC BY ID
   GET /api/topics/:id
========================================= */
router.get('/:id', controller.getById);

/* =========================================
   CREATE TOPIC
   POST /api/topics
========================================= */
router.post('/', controller.add);

/* =========================================
   UPDATE TOPIC
   PUT /api/topics/:id
========================================= */
router.put('/:id', controller.update);

/* =========================================
   DELETE TOPIC
   DELETE /api/topics/:id
========================================= */
router.delete('/:id', controller.remove);

module.exports = router;
