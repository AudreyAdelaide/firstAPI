const multer = require('multer');
// const Sauce = require('../models/sauce');

// dictionnaire des formats d'image
const MIME_TYPES = {
    'image/jps': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        // // on remplace les espaces par des underscore "_"
        // // const name = file.originalname.split(' ').join('_'); <=== code provenant du cours " passez au fullstack "

                        // Je transforme la sauce en Objet afin de récupérer le nom
                        // const sauceObject = JSON.parse(req.body.sauce)
                        // // Je remplace les espaces par des underscore
                        // const replaceSpace = sauceObject.name.split(' ').join('_');
                        // // Je remplace les ' par des _
                        // const sauceObjectName = replaceSpace.replace("'", "_");

        // Je récupère le format de l'image
        const extension = MIME_TYPES[file.mimetype];
        // // console.log(Date.now())
        // // Ici je change le nom de l'image pour que ce soit le nom de la sauce
        callback(null, "imageSauce" + "_" + Date.now() + '.' + extension);
        // callback(null, Date.now() + '_' + file.originalname);

        // const name = file.originalname.split(' ').join('_').split(".")[0];
        // const extension = MIME_TYPES[file.mimetype];
        // callback(null, name + Date.now() + "." + extension);

    }
});

module.exports = multer({ storage }).single('image');