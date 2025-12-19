import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
export const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Malformed token' });
    }
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload;
        next();
    }
    catch {
        return res.status(403).json({ message: 'Invalid token' });
    }
};
//# sourceMappingURL=auth.middleware.js.map