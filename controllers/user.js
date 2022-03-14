const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

// Permet a un utilisateur de s'inscrire
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) // Cryptage du mot de passe
    .then(hash => {

        const user = new User({
            email: req.body.email,
            password: hash
        });

        user.save()
            .then(() => res.status(201).json({ message: 'Nouvel utilisateur créé.' }))
            .catch(error => res.status(401).json({ error }));
    })
    // .catch(error => res.status(500).json({ error }));
    .catch(error => res.status(500).json({ ERROR: "Cet utilisateur existe déjà !" }));
};

// Permet à un utilisateur existant de se connecter
exports.login = (req, res, next) => {
    // console.log(req.body);
    User.findOne({ email: req.body.email })
    .then(user => {
        if (!user) {
            return res.status(401).json({ ERROR: "Cet utilisateur n'existe pas." });
        }
        bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid) {
                    return res.status(401).json({ ERROR: 'Mot de passe incorrect !' });
                }
                res.status(200).json({ 
                    userId: user._id,
                    token: jwt.sign(
                        { userId: user._id },
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn: '24h' }
                    )
                });
            })
            .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

