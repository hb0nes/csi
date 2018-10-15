// Hapi voor...Hapiness.
const Hapi = require('hapi');
// Environment variabelen
require('dotenv').config({ path: __dirname + "/.env" });
const db = require('./models')
const routes = require('./routes');
const l = require('./logger');

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
        l.info("Successfully authenticated.");
    }
    catch (err) {
        l.error('Failed Authentication.', err);
    }
    // FOREIGN_KEY_CHECKS=0, anders kan hij tabellen niet weggooien
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { raw: true });
    // Maak de tabellen aan en drop ze als ze nog niet bestaan
    await db.User.sync({ force: true });
    db.Message.sync({ force: true });

    // HAPI server
    const server = Hapi.server({
        port: process.env.PORT || 3000,
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
        l.info(`Server running at: ${server.info.uri}`);
    }
    catch (err) {
        l.error("Error:", err)
    }
})();
