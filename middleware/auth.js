const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        // console.log("User ID : " + userId);
        // console.log("Token : " + token)
        req.auth = { userId };
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable !'; // throw pour renvoyer l'erreur dans le catch
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({ error: new Error('Requête non authentifée ! Hello') });
    }
};