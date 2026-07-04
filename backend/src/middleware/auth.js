const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const cookieHeader = req.headers.cookie || '';
  const tokenFromCookie = cookieHeader
    .split(';')
    .map((item) => item.trim())
    .find((item) => item.startsWith('token='))
    ?.split('=')[1];
  const tokenFromHeader = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;
  const token = tokenFromCookie || tokenFromHeader;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed. Access denied.',
      errors: ['No token found in cookie or authorization header']
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach decoded user payload to request. User payload contains id.
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed. Invalid token.',
      errors: [error.message]
    });
  }
};

module.exports = authMiddleware;
