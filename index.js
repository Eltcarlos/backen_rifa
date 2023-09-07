const Server = require("./server");

require("dotenv").config();

// Run instance server

const server = new Server();

// Execute server

server.execute();
