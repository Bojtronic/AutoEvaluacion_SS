const { Router } = require("express");
const controller = require("../controllers/results_controller");

const router = Router();

/* =========================================
   GET RESULTS
   GET /api/results
========================================= */
router.get("/", controller.getAllResults);

/* =========================================
   CREATE ATTEMPT
   POST /api/results/attempt
========================================= */
router.post("/attempt", controller.createAttempt);

/* =========================================
   SAVE ANSWER
   POST /api/results/answer
========================================= */
router.post("/answer", controller.saveAnswer);

/* =========================================
   FINISH ATTEMPT
   POST /api/results/finish
========================================= */
router.post("/finish", controller.finishAttempt);

/* =========================================
   GET RESULTS BY USER
   GET /api/results/user/:user_id
========================================= */
router.get("/user/:user_id", controller.getResultsByUser);

/* =========================================
   GET ATTEMPT DETAIL
   GET /api/results/attempt/:attempt_id
========================================= */
router.get("/attempt/:attempt_id", controller.getAttemptDetail);

module.exports = router;
