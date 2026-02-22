const { Router } = require('express');
const controller = require('../controllers/exams_controller');

const router = Router();

/* =========================================
   GET ALL EXAMS
   GET /api/exams
========================================= */
router.get('/', controller.get);

/* =========================================
   GET EXAM BY ID
   GET /api/exams/:id
========================================= */
router.get('/:id', controller.getById);

/* =========================================
   CREATE EXAM
   POST /api/exams
========================================= */
router.post('/', controller.add);

/* =========================================
   UPDATE EXAM
   PUT /api/exams/:id
========================================= */
router.put('/:id', controller.update);

/* =========================================
   DELETE EXAM
   DELETE /api/exams/:id
========================================= */
router.delete('/:id', controller.remove);


/* =========================================
   GET TOPICS BY EXAM
   GET /api/exams/:id/topics
========================================= */
router.get('/:id/topics', controller.getTopics);

/* =========================================
   ADD TOPIC TO EXAM
   POST /api/exams/:id/topics
   body: { topic_id }
========================================= */
router.post('/:id/topics', controller.addTopic);

/* =========================================
   REMOVE TOPIC FROM EXAM
   DELETE /api/exams/:id/topics/:topicId
========================================= */
router.delete('/:id/topics/:topicId', controller.removeTopic);


/* =========================================
   GET QUESTIONS BY EXAM
   GET /api/exams/:id/questions
========================================= */
router.get('/:id/questions', controller.getQuestions);

/* =========================================
   ADD QUESTION TO EXAM
   POST /api/exams/:id/questions
   body: { question_id }
========================================= */
router.post('/:id/questions', controller.addQuestion);

/* =========================================
   REMOVE QUESTION FROM EXAM
   DELETE /api/exams/:id/questions/:questionId
========================================= */
router.delete('/:id/questions/:questionId', controller.removeQuestion);


module.exports = router;
