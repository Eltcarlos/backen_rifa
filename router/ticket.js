const { Router } = require("express");
const ticket = require("../controllers/tickets");
const { rotateRadians } = require("pdf-lib");
const router = Router();

router.post("/load-tickets", ticket.loadTickets);
router.get("/fetch/tickets", ticket.getTicketsByUser);
router.post("/manual-load", ticket.loadManualTickets);

module.exports = router;
