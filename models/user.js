const mongoose = require('mongoose');
// Installation de mongoose-unique-validator afin d'éviter les erreurs
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true }, // adresse mail utilisée une seule fois pour la création d'utilisateur
    password: { type: String, required: true }
});

// on s'assure que deux utilisateurs ne peuvent pas s'inscrire avec la même adresse email
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);