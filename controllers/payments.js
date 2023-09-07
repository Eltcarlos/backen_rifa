const { default: axios } = require("axios");

const createPayment = async (req, res) => {
  try {
    const data = req.body;

    const url = process.env.URL_WOMPY;
    const token = process.env.WOMPY_PUBLIC;

    const response = await axios.post(`${url}/payment_links`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    res.status(200).json({
      success: true,
      message: "Pago creado correctamente",
      data: response?.data.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear el pago",
      error,
    });
  }
};

module.exports = {
  createPayment,
};
