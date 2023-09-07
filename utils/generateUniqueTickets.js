const Ticket = require("../models/ticket");

const generateUniqueTickets = async (nTickets, raffleId) => {
  const uniqueTickets = [];

  for (let i = 0; i < nTickets; i++) {
    let uniqueNumber;
    do {
      uniqueNumber = Math.floor(10000 + Math.random() * 90000);
    } while (
      uniqueTickets.includes(uniqueNumber) ||
      (await Ticket.findOne({ number: uniqueNumber, raffle: raffleId }))
    );

    uniqueTickets.push(uniqueNumber);
  }

  return uniqueTickets;
};

module.exports = generateUniqueTickets;
