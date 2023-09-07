const jwt = require("jsonwebtoken");

/**
 * Generates an authentication token using the jsonwebtoken (jwt) library.
 *
 * @param {Object} user - Object containing user information.
 * @param {string} user._id - Unique user ID.
 * @param {string} user.email - User's email address.
 * @returns {string} token - Generated authentication token.
 * @throws {Error} If there's an issue generating the token.
 */
const generateAuthToken = (user) => {
  try {
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_KEY,
      { expiresIn: "30d" }
    );
    return token;
  } catch (error) {
    throw new Error("Error al generar el token de autenticación");
  }
};

/**
 * Generates an authentication token using the jsonwebtoken (jwt) library.
 *
 * @param {Object} user - Object containing user information.
 * @param {string} user._id - Unique user ID.
 * @param {string} user.email - User's email address.
 * @returns {string} token - Generated authentication token.
 * @throws {Error} If there's an issue generating the token.
 */

const generateRefreshToken = (user) => {
  const refreshToken = jwt.sign({ userId: user._id, email: user.email }, process.env.REFRESH_JWT_KEY, {
    expiresIn: "7d",
  });
  return refreshToken;
};

module.exports = { generateAuthToken, generateRefreshToken };
