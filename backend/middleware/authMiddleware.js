const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const { query } = require('../config/db');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Fetch user from Postgres
      const { rows } = await query('SELECT id, email, role FROM users WHERE id = $1', [decoded.id]);
      
      if (rows.length === 0) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      req.user = rows[0];
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`User role '${req.user?.role}' is not authorized to access this route`);
    }
    next();
  };
};

module.exports = { protect, authorize };
