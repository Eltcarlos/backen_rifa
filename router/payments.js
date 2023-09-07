const { Router } = require("express");
const payments = require("../controllers/payments");
const router = Router();

router.post("/create", payments.createPayment);

module.exports = router;
