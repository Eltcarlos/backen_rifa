const { Router } = require("express");
const ticket = require("../controllers/tickets");
const router = Router();

router.post("/load-tickets", ticket.loadTickets);
router.get("/fetch/tickets", ticket.getTicketsByUser);

module.exports = router;
