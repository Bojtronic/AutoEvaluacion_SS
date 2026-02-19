const { Router } = require("express");
const controller = require("../controllers/questions_controller");

const router = Router();

/* =========================================
   GET ALL QUESTIONS
   GET /api/questions
========================================= */
router.get("/", controller.get);

/* =========================================
   GET QUESTION BY ID
   GET /api/questions/:id
========================================= */
router.get("/:id", controller.getById);

/* =========================================
   CREATE QUESTION
   POST /api/questions
========================================= */
router.post("/", controller.add);

/* =========================================
   UPDATE QUESTION
   PUT /api/questions/:id
========================================= */
router.put("/:id", controller.update);

/* =========================================
   DELETE QUESTION
   DELETE /api/questions/:id
========================================= */
router.delete("/:id", controller.remove);

module.exports = router;
