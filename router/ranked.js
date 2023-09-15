const { Router } = require("express");
const ranked = require("../controllers/ranked");
const router = Router();

router.get("/top", ranked.getTopUsersByPurchasedTickets);

module.exports = router;
