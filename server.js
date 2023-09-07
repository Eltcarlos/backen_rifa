const express = require("express");
const http = require("http");
const logger = require("morgan");
const cors = require("cors");
const connectDB = require("./database/config");
const routerMain = require("./router/index");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    // Connect DB
    connectDB();
    this.server = http.createServer(this.app);
  }

  middlewares() {
    //Morgan
    this.app.use(logger("dev"));
    //CORS
    this.app.use(cors());
    //Parse Body
    this.app.use(express.json());
    //Routes
    this.app.use("/", routerMain);
    // ERROR HANDLER
    this.app.use((err, req, res, next) => {
      console.log(err);
      res.status(err.status || 500).send(err.stack);
    });
  }

  execute() {
    // Run Middlewares
    this.middlewares();

    this.server.listen(this.port, () => {
      console.log("Server is running on port:", this.port);
    });
  }
}

module.exports = Server;
