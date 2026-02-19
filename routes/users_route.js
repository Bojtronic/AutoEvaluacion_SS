const { Router } = require("express");
const controller = require("../controllers/users_controller");

const router = Router();

router.get("/", controller.get);
router.get("/:id", controller.getById);
router.post("/", controller.add);
router.put("/:id", controller.update);
router.put("/:id/password", controller.changePassword);
router.delete("/:id", controller.remove);

module.exports = router;
