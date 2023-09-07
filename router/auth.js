const { Router } = require("express");
const auth = require("../controllers/auth");
const { authenticateRefreshToken } = require("../middlewares/authUser");
const router = Router();

router.post("/login", auth.login);
router.post("/sign-up", auth.signUp);
router.post("/refresh-token", authenticateRefreshToken, auth.refreshToken);
router.post("/is-available", auth.isAvailable);

module.exports = router;
