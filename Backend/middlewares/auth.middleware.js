const userModel = require('../models/user.model');
const BlacklistToken = require('../models/blacklistToken.model');

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];

    // Check if token is blacklisted
    const blacklisted = await BlacklistToken.findOne({ token });
    if (blacklisted) {
        return res.status(401).json({ message: 'Token is blacklisted' });
    }

    try {
        const user = await userModel.verifyAuthToken(token);
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};


