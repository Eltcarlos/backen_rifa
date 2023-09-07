const jwt = require("jsonwebtoken");

/**
 * Middleware to authenticate requests using JWT token.
 *
 * This middleware checks the Authorization header for a JWT token, verifies its validity,
 * and attaches the decoded user information to the request object before allowing access to protected routes.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Callback function to proceed to the next middleware or route.
 * @returns {void}
 */
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not provided",
      });
    }

    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Token verification failed",
        });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred during token authentication",
      error: error.message,
    });
  }
};

/**
 * Middleware to refreshToken requests using JWT token.
 *
 * This middleware checks the Authorization header for a JWT token, verifies its validity,
 * and attaches the decoded user information to the request object before allowing access to protected routes.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Callback function to proceed to the next middleware or route.
 * @returns {void}
 */

const authenticateRefreshToken = (req, res, next) => {
  try {
    const refreshHeader = req.headers["refresh_token"];
    const refreshToken = refreshHeader && refreshHeader.split(" ")[1];

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token not provided",
      });
    }

    jwt.verify(refreshToken, process.env.REFRESH_JWT_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Refresh token verification failed",
        });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred during refresh token authentication",
      error: error.message,
    });
  }
};

module.exports = { authenticateToken, authenticateRefreshToken };
