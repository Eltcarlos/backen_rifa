const User = require("../models/user");

const getTopUsersByPurchasedTickets = async (req, res) => {
  try {
    // Obtener todos los usuarios
    const allUsers = await User.find().select("name purchasedTickets");

    // Calcular la cantidad de boletos comprados para cada usuario y ordenarlos en orden descendente
    const topUsers = allUsers
      .map((user) => ({
        name: user.name,
        purchasedTicketsCount: user.purchasedTickets.length,
      }))
      .sort((a, b) => b.purchasedTicketsCount - a.purchasedTicketsCount)
      .slice(0, 3); // Obtener los 3 primeros usuarios con más boletos comprados

    // Calcular el rango
    const topUsersWithRange = topUsers.map((user) => {
      const rangePercentage = user.purchasedTicketsCount < 100 ? 0.2 : 0.1;
      const minRange = Math.floor(user.purchasedTicketsCount * (1 - rangePercentage));
      const maxRange = Math.ceil(user.purchasedTicketsCount * (1 + rangePercentage));
      return {
        ...user,
        purchasedTicketsRange: `${minRange} - ${maxRange}`,
      };
    });

    res.json(topUsersWithRange);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el ranking de usuarios" });
  }
};

module.exports = { getTopUsersByPurchasedTickets };
