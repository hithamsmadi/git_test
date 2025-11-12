import jwt from 'jsonwebtoken';

const { JWT_SECRET } = process.env;

export const verifyToken = (req, res, next) => {
  if (!JWT_SECRET) {
    return res.status(500).json({ message: 'Authentication is not configured' });
  }

  const header = req.headers.authorization;
  const token = header?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
