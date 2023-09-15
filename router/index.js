const express = require("express");
const auth = require("./auth");
const raffles = require("./raffles");
const ticket = require("./ticket");
const payments = require("./payments");
const users = require("./users");
const ranked = require("./ranked");

// Route Main
const routerMain = express.Router();
const { authenticateToken } = require("../middlewares/authUser");

// Route Children
routerMain.use("/api/v1/auth", auth);
routerMain.use("/api/v1/raffles", authenticateToken, raffles);
routerMain.use("/api/v1/tickets", authenticateToken, ticket);
routerMain.use("/api/v1/payments", authenticateToken, payments);
routerMain.use("/api/v1/users", authenticateToken, users);
routerMain.use("/api/v1/ranked", ranked);

module.exports = routerMain;
