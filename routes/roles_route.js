const { Router } = require("express");
const controller = require("../controllers/roles_controller");

const router = Router();

router.get("/", controller.get);

module.exports = router;
