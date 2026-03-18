const { Router } = require("express");
const multer = require("multer");
const controller = require("../controllers/questions_controller");

const router = Router();

// Multer en memoria
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Solo se permiten imágenes"), false);
        }
    },
    limits: {
        fileSize: 2 * 1024 * 1024
    }
});

/* =========================================
   UPLOAD IMAGE FOR OPTION
   POST /api/questions/option-image
========================================= */
router.post("/option-image", upload.single("image"), controller.uploadOptionImage);

/* =========================================
   GET IMAGE BY OPTION
   GET /api/questions/option-image/:option_id
========================================= */
router.get("/option-image/:option_id", controller.getOptionImage);

/* =========================================
   GET QUESTION BY TOPIC
   GET /api/questions/by_topic?topic_id=1
========================================= */
router.get("/by_topic", controller.getByTopic);

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
