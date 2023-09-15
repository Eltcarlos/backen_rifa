const User = require("../models/user");

const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    let query = User.find().select("-createdAt -updatedAt -password");

    if (req.query.email) {
      // Si hay un parámetro de consulta 'email', agregamos la condición de búsqueda
      query = query.where("email").regex(new RegExp(req.query.email, "i"));
    }

    const totalUsers = await User.countDocuments(query); // Corregido aquí
    const totalPages = Math.ceil(totalUsers / limit);

    const users = await query
      .populate([
        {
          path: "purchasedTickets",
          select: "number",
        },
      ])
      .populate([
        {
          path: "participatedRaffles",
          select: "name",
        },
      ])
      .skip(startIndex)
      .limit(limit);

    res.json({
      users,
      currentPage: page,
      totalPages,
      totalUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
};

module.exports = { getAllUsers };
