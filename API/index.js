// APM for ELK
const apm = require('elastic-apm-node').start({
    serviceName: 'cysedm-api',
  
    // Use if APM Server requires a token
    // secretToken: '',
  
    // Set custom APM Server URL (default: http://localhost:8200)
    serverUrl: 'http://192.168.1.250:8200'
  })
// Hapi for...Hapiness.
const Hapi = require('hapi');
// Environment variables
require('dotenv').config({ path: __dirname + "/.env" });
const db = require('./models')
const routes = require('./routes');
const l = require('./logger');
const fs = require('fs');

// Certificate
const privateKey = fs.readFileSync(__dirname + '/ssl/privkey.pem', 'utf8');
const certificate = fs.readFileSync(__dirname + '/ssl/cert.pem', 'utf8');


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
    let tls = "";
    if (process.env.ENV === "production") {
        tls = {
            key: privateKey,
            cert: certificate
        }
    } else {
        tls = false;
    }
    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: '0.0.0.0',
        tls: tls,
        routes: {
            cors: {
                origin: ['http://localhost:8080', 'https://b-it-s.nl', 'https://www.b-it-s.nl'],
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
        isSecure: (process.env.ENV === "production"),
        isHttpOnly: true,
        isSameSite: 'Strict',
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
