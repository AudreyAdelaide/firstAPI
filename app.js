const express = require("express");
const mongoose = require("mongoose");

// Permet d'accèder au dossier des images
const path = require('path');

// Variable d'environnement
const dotenv = require("dotenv");
dotenv.config();
const MY_DB = process.env.MONGODB_CONNECT;

// const Sauce = require('./models/sauce');
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

const app = express();
app.use(express.json()); // Intercepte toutes les requêtes qui contiennent du json et mets à disposition le corp de la requête sur la requête dans req.body

// Connexion à la base de donnée
mongoose.connect(MY_DB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connexion à MongoDB réussis !"))
    .catch(() => console.log("Connexion à MongoDB échouée !"));


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");

    next();
});

// On indique le lien statique du dossier images
app.use('/images',express.static(path.join('images')));

app.use("/api/auth", userRoutes);
app.use('/api/sauces', sauceRoutes);


// expore de app afin de pouvoir l'utiliser depuis les autres fichiers
module.exports = app;
