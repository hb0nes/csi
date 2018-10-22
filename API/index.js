// Hapi for...Hapiness.
const Hapi = require('hapi');
// Environment variables
require('dotenv').config({ path: __dirname + "/.env" });
const db = require('./models')
const routes = require('./routes');
const l = require('./logger');

const io = require('./plugins/io');

// Credential validation
const validate = async function (decoded, request) {
    // Find user by ID
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
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { raw: true });
    await db.User.sync({ force: true });
    db.Message.sync({ force: true });

    // HAPI server
    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: '0.0.0.0',
        routes: {
            cors: {
                origin: ['*'],
                credentials: true
            }
        }
    });

    // Cookie settings
    server.state('token', {
        ttl: 24 * 60 * 60 * 1000,
        isSecure: false,
        isHttpOnly: true,
        // isSameSite: false,
        isSameSite: 'Strict',
        encoding: 'none',
        path: '/',
        clearInvalid: true,
        strictHeader: true
    });
    // Register JWT2 plugin
    await server.register(require('hapi-auth-jwt2'));

    // Define strategy
    server.auth.strategy('jwt', 'jwt',
        {
            key: process.env.SECRET,
            validate: validate,
            verifyOptions: { algorithms: ['HS256'] }
        });
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
