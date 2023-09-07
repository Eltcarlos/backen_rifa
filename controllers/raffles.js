const Raffle = require("../models/raffle");
const User = require("../models/user");
const Ticket = require("../models/ticket");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dx6ypkrpt",
  api_key: "577848936244537",
  api_secret: "DmaVXNehbs9endvOS0EEqAf8OF0",
});

const getAllRaffles = async (req, res) => {
  try {
    const raffle = await Raffle.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Todos las rifas se han encontrado.",
      data: raffle,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Ha ocurrido un error al encontrar todas las rifas.",
      error,
    });
  }
};

const getRaffleById = async (req, res) => {
  try {
    const { id } = req.params;
    const raffle = await Raffle.findById(id);

    if (!raffle) {
      return res.status(404).json({
        success: false,
        message: "La rifa no se ha encontrado.",
      });
    }

    res.status(200).json({
      success: true,
      message: "La rifa se ha encontrado con éxito.",
      data: raffle,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Ha ocurrido un error al encontrar la rifa.",
      error,
    });
  }
};

const updateRaffle = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const raffleUpdated = await Raffle.findByIdAndUpdate(id, { name, description });

    if (!raffleUpdated) {
      return res.status(404).json({
        success: false,
        message: "No se ha encontrado.",
      });
    }
    res.status(200).json({
      success: true,
      message: "La rifa se actualizó correctamente.",
      data: raffleUpdated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Ha ocurrido un error al actualizar la rifa.",
      error,
    });
  }
};

const createRaffle = async (req, res) => {
  try {
    const { name, description } = req.body;

    const posterImage = req.files.posterImage[0];
    const backgroundImage = req.files.backgroundImage[0];

    const cloudUploadPoster = await cloudinary.uploader.upload(posterImage.path);
    const cloudUploadBackground = await cloudinary.uploader.upload(backgroundImage.path);

    const newRaffle = new Raffle({
      name,
      description,
      posterImage: cloudUploadPoster.url,
      backgroundImage: cloudUploadBackground.url,
    });
    await newRaffle.save();

    res.status(200).json({
      success: true,
      message: "Se ha creado la rifa.",
      data: newRaffle,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Ha ocurrido un error al crear la rifa.",
      error,
    });
  }
};

const deleteRaffle = async (req, res) => {
  try {
    const raffleId = req.params.id;
    console.log("Raffle ID:", raffleId); // Añade un registro para verificar el ID de la rifa

    const raffle = await Raffle.findById(raffleId);
    if (!raffle) {
      return res.status(404).json({
        success: false,
        message: "Raffle not found",
      });
    }

    // Realiza las operaciones de eliminación aquí
    await User.updateMany({ participatedRaffles: raffleId }, { $pull: { participatedRaffles: raffleId } });
    await Ticket.deleteMany({ raffle: raffleId });

    // Aquí debes eliminar la instancia de la rifa
    await Raffle.findByIdAndDelete(raffleId);

    res.status(200).json({ message: "Raffle deleted successfully" });
  } catch (error) {
    console.error("Error:", error); // Agrega un registro de errores aquí para depuración
    res.status(500).json({
      success: false,
      message: "Error deleting raffle",
      error,
    });
  }
};

module.exports = { getAllRaffles, getRaffleById, updateRaffle, createRaffle, deleteRaffle };
