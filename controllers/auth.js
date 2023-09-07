const User = require("../models/user");
const { generateAuthToken, generateRefreshToken } = require("../libs/jwt");

/**
 * Handles user registration.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - JSON response indicating success or failure of registration.
 */

const signUp = async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Este Usuario ya existe.",
        error: err,
      });
    }
    const existingPhone = await User.findOne({ phoneNumber });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Este Numero ya existe.",
        error: err,
      });
    }
    const newUser = new User({
      name,
      email,
      password: await User.encryptPassword(password),
      phoneNumber,
    });
    await newUser.save();
    res.status(201).json({
      success: true,
      message: "El registro se realizo correctamente.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Hubo un error con el registro del usuario.",
      error,
    });
  }
};

/**
 * Handles user login authentication.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} - JSON response indicating success or failure of authentication.
 */

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const isPasswordValid = await User.comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const access_token = generateAuthToken(user);
    const refresh_token = generateRefreshToken(user);

    return res.status(201).json({
      success: true,
      access_token,
      refresh_token,
      data: {
        uid: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred during user login.",
      error,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Refresh token verification failed",
        });
      }
      const foundUser = await User.findById(user.id);

      if (!foundUser) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }
      const accessToken = jwt.sign({ id: foundUser._id, email: foundUser.email }, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });

      return res.status(200).json({
        success: true,
        message: "Access token refreshed successfully",
        accessToken,
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred during refresh token.",
      error,
    });
  }
};

const isAvailable = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      res.status(200).json({ isAvailable: false });
    }
    res.status(200).json({
      isAvailable: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred during Valid email.",
    });
  }
};

module.exports = {
  signUp,
  login,
  refreshToken,
  isAvailable,
};
