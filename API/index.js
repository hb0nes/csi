// Hapi for...Hapiness.
const Hapi = require('hapi');
// Environment variables
require('dotenv').config({ path: __dirname + "/.env" });
const db = require('./models')
const routes = require('./routes');
const l = require('./logger');


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
    // await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { raw: true });
    await db.User.sync({ force: false });
    db.Message.sync({ force: false });

    // HAPI server
    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: '0.0.0.0',
        routes: {
            cors: {
                origin: ['http://localhost:8080', 'http://b-it-s.nl', 'http://www.b-it-s.nl'],
                credentials: true
            }
        }
    });
    
    // Define socket that shares the port of HAPI and creates new rooms for each connection
    // to directly contact them.
    const io = require('socket.io')(server.listener);
    io.sockets.on('connection', function (socket) {
        // data is username of person who went to view their messages
        socket.on('join', function (data) {
            if (data) {
                socket.join(data); // join private room
            }
        });
    });
    server.decorate('toolkit', 'io', io);

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
