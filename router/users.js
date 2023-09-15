const { Router } = require("express");
const user = require("../controllers/user");
const router = Router();

router.get("/all", user.getAllUsers);

module.exports = router;
