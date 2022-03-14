const Sauce = require("../models/sauce");
const path = require("path");
const fs = require("fs");

// ====== AJOUTER UNE SAUCE
exports.createSauce = (req, res, next) => {
    // On créé l'objet sauce
    const sauceObject = JSON.parse(req.body.sauce);
    //je supprime l'id généré automatiquement
    delete sauceObject._id;

    const sauce = new Sauce({
        // Ici on récupère tous ce qu'il y a dans le body de la sauce
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    });
    // Enregistrement de la nouvelle sauce sur MongoDB
    sauce.save()
        .then(() => res.status(201).json({ message: "Sauce ajoutée avec succès !" }))
        .catch((error) => res.status(400).json({ error }));
};

// ====== MODIFIER UNE SAUCE EN PARTICULIER
exports.modifySauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }).then((sauce) => {
        if (!sauce) { // Si la sauce n'existe pas
            return res.status(404).json({ ERROR: "Cette sauce n'existe pas !" });
        }
        if (sauce.userId !== req.auth.userId) { // Si le userId ne correspond pas a celui du propriétaire de la sauce
            return res.status(401).json({  ERROR: "Seul le propriétaire de cette sauce peut la modifier !" });
        }
        if (!req.file) { // S'il n'y a pas de nouvelle image 
            Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
                .then(() => res.status(200).json({ message: "La sauce a été modifiée avec succès !" }))
                .catch((error) => res.status(400).json({ error }));
        } else {
            // On récupère le nom du fichier
            const file = sauce.imageUrl.split("/")[4];
            const fileUrl = path.join("images/" + file);

            // On supprime l'ancienne image
            fs.unlink(fileUrl, () => {
                // console.log("img delete !");
                return res.status(201).json({ message: "L'image a bien été modifiée!" });
            });

            // On donne la nouvelle image
            const sauceImgUrl = `${req.protocol}://${req.get("host")}/${req.file.destination}/${req.file.filename}`;

            Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id, imageUrl: sauceImgUrl })
                .then(() => res.status(200).json({ message: "La sauce a été modifiée avec succès !" }))
                .catch((error) => res.status(400).json({ error }));
        }
    });
};

// ====== SUPPRIMER UNE SAUCE EN PARTICULIER
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }).then((sauce) => {
        if (!sauce) { // Si la sauce n'existe pas
            return res.status(404).json({ ERROR: "Cette sauce n'existe pas !" });
        }
        // On vérifie que c'est bien le propriétaire qui souhaite supprimer la sauce
        if (sauce.userId !== req.auth.userId) {
            return res.status(401).json({ ERROR: "Seul le propriétaire de cette sauce peut la supprimer !" });
        }
        // On récupère le nom du fichier
        const file = sauce.imageUrl.split("/")[4];
        const fileUrl = path.join("images/" + file);

        // On supprime l'image et les données de la sauce qui vont avec
        fs.unlink(fileUrl, () => {
            Sauce.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: "La sauce a été supprimé avec succès!" }))
                .catch((error) => res.status(400).json({ error }));
        });
    });
};

// ====== AFFICHER UNE SAUCE EN PARTICULIER
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(404).json({ error }));
};

// ====== AFFICHER TOUTES LES SAUCES
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then((sauces) => res.status(200).json(sauces))
        .catch((error) => res.status(400).json({ error }));
};

// ================= LES LIKES ET DISLIKES

exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            switch (req.body.like) {
                case 0: // Si like = 0 alors l'utilisateur annul son like
                    Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId }})
                        .then(() => res.status(201).json({ message: `L'utilisateur a annulé son like !` }))
                        .catch((error) => res.status(401).json({ error }));

                    break;

                case 1: // Si like = 1 alors l'utilisateur aime la sauce
                    Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: +1 }, $push: { usersLiked: req.body.userId } })
                        .then(() => res.status(201).json({ message: `L'utilisateur a liké la sauce !` }))
                        .catch((error) => res.status(401).json({ error }));

                    break;

                case -1: // Si like = -1 alors l'utilisateur n'aime pas la sauce

                    Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: +1 }, $push: { usersDisliked: req.body.userId }})
                        .then(() => res.status(201).json({ message: `L'utilisateur n'aime pas la sauce !` }))
                        .catch((error) => res.status(401).json({ error }));

                    break;
            }
        })
        .catch((error) => res.status(400).json({ error }));
};

