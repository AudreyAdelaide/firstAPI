// Import du package http
const http = require("http");
const app = require("./app");

// Utilisation des variabbles d'environnement
const dotenv = require("dotenv");
dotenv.config();

const MY_PORT = process.env.PORT;

// normalizePort renvoie un port valide, qu'il soit fourni sous forme d'un numéro ou d'une chaîne;
const normalizePort = (val) => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

const port = normalizePort(MY_PORT || "3000");
app.set("port", port);

// errorHandler recherche les différentes erreurs et les gère de manière appropriée. Elle est ensuite enregistrée dans le serveur;
const errorHandler = (error) => {
    if (error.syscall !== "listen") {
        // Que veut dire cette ligne ???????????????
        throw error;
    }

    const address = server.address();
    const bind = typeof address === "string" ? "pipe" + address : "port: " + port; // Que veut dire cette ligne ????????????????
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges."); // bind + Nécessite des privilèges élevés.
            process.exit(1); // Que veut dire cette ligne ????????????????
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use."); // bind + est déjà en cours d'utilisation.
            process.exit(1);
            break;
        default:
            throw error;
    }
};

// Création du serveur
const server = http.createServer(app);

server.on("error", errorHandler);
server.on("listening", () => {
    const address = server.address();
    const bind = typeof address === "string" ? "pipe" + address : "port" + port;
    console.log("listening on " + bind);
});

// Port sur lequel fonctionne le server
server.listen(port);
