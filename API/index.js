// Hapi voor...Hapiness.
const Hapi = require('hapi');
// Environment variabelen
require('dotenv').config({ path: __dirname + "/.env" });
const path = require('path');
const fs = require('fs');
const db = require('./models')
const routes = require('./routes');

// Credential validatiefunctie
const validate = async function (decoded, request) {
    // Vind user met ID
    let user = await db.User.findOne({ where: { id: decoded.id } });
    if (user) {
        return { isValid: true };
    }
    else {
        return { isValid: false };
    }
};

(async () => {
    // Authenticate Sequelize
    try {
        await db.sequelize.authenticate();
        console.log('Succesfully authenticated.');
    }
    catch (err) {
        console.log('Failed authentication:', err)
    }
    // FOREIGN_KEY_CHECKS=0, anders kan hij tabellen niet weggooien
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { raw: true });
    // Maak de tabellen aan en drop ze als ze nog niet bestaan
    await db.User.sync({ force: true });
    db.Message.sync({ force: true });

    // HAPI server
    const server = Hapi.server({
        tls: {
             key: fs.readFileSync(path.join(__dirname, 'ssl', 'key.pem'), 'utf8'),
             cert: fs.readFileSync(path.join(__dirname, 'ssl', 'server.crt'), 'utf8')
        },
        port: 3000,
        host: '0.0.0.0'
    })
    // Registreer JWT2 plugin
    await server.register(require('hapi-auth-jwt2'));
    // Definieer strategie
    server.auth.strategy('jwt', 'jwt',
        {
            key: process.env.SECRET,  // Geheim voor HMAC hash. Staat gedefinieerd in .env in de root
            validate: validate, // Roep validate functie aan bovenaan
            verifyOptions: { algorithms: ['HS256'] }
        });
    // Zet deze strategie op default
    server.auth.default('jwt');
    // Load routes
    server.route(routes);
    await server.start();
    try {
        console.log(`Server running at: ${server.info.uri}`);
    }
    catch (err) {
        console.log("Error:", err)
    }
})();
