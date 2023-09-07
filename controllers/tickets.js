const Ticket = require("../models/ticket");
const User = require("../models/user");
const Raffle = require("../models/raffle");
const Transaction = require("../models/transaction");
const generateUniqueTickets = require("../utils/generateUniqueTickets");
const { default: axios } = require("axios");

const loadTickets = async (req, res) => {
  try {
    const { nTickets, raffleID, transactionID } = req.body;
    const { id } = req.user;
    const userID = id;
    const url = process.env.URL_WOMPY;
    const token = process.env.WOMPY_PUBLIC;

    const response = await axios.get(`${url}/transactions/${transactionID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const existingTransaction = await Transaction.findOne({
      transactionId: transactionID,
    });

    if (existingTransaction) {
      return res.status(200).json({ success: false, message: "Transacción duplicada." });
    }

    const newTransaction = new Transaction({
      transactionId: transactionID,
      raffle: raffleID,
      user: userID,
    });

    await newTransaction.save();

    if (response.data.data.status !== "APPROVED") {
      return res.status(200).json({
        success: false,
        message: "Hubo un error intente nuevamente",
      });
    }

    const user = await User.findById(userID);
    const raffle = await Raffle.findById(raffleID);

    if (!user || !raffle) {
      return res.status(401).json({
        success: false,
        message: "Usuario o Rifa no encontrada.",
      });
    }

    const uniqueTickets = await generateUniqueTickets(nTickets, raffleID);

    const purchasedTickets = [];
    for (const uniqueNumber of uniqueTickets) {
      const ticket = new Ticket({
        number: uniqueNumber,
        raffle: raffleID,
        buyer: userID,
      });
      await ticket.save();
      purchasedTickets.push(ticket._id);
    }

    user.purchasedTickets = [...user.purchasedTickets, ...purchasedTickets];
    raffle.soldTickets = [...raffle.soldTickets, ...purchasedTickets];

    if (!user.participatedRaffles.includes(raffleID)) {
      user.participatedRaffles.push(raffleID);
    }

    if (!raffle.participatingUsers.includes(userID)) {
      raffle.participatingUsers.push(userID);
    }

    await user.save();
    await raffle.save();

    return res.status(200).json({
      success: true,
      message: `Se compraron boletos exitosamente.`,
      data: {
        idTransaction: response.data.data.id,
        status: response.data.data.status,
        amount: response.data.data.amount_in_cents / 100,
        email: response.data.data.customer_email,
        tickets: `Se compraron ${nTickets} boletos exitosamente.`,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al comprar los boletos.",
      error,
    });
  }
};

const getTicketsByUser = async (req, res) => {
  const { id } = req.user;
  const { page = 1, limit = 5 } = req.query;
  try {
    const user = await User.findById(id)
      .populate([
        {
          path: "purchasedTickets",
          options: {
            skip: (page - 1) * limit,
            limit: parseInt(limit),
          },
          populate: {
            path: "raffle", // Correct path to populate
            select: "name description status",
          },
        },
      ])
      .populate({
        path: "participatedRaffles",
        select: "name description posterImage",
      });

    return res.status(200).json({
      success: true,
      message: `Se obtuvo correctamente el usuario`,
      data: {
        name: user.name,
        role: user.role,
        participatedRaffles: user.participatedRaffles,
        purchasedTickets: user.purchasedTickets,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al cargar el usuario",
      error,
    });
  }
};
module.exports = { loadTickets, getTicketsByUser };
