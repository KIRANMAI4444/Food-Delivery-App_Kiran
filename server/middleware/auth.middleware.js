import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Verify JWT and attach user to req
export const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 2. No token → reject
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Find user by ID from token
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // 5. Attach user to request for the next function
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Restrict route to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role '${req.user?.role}' is not allowed to access this route`,
      });
    }
    next();
  };
};