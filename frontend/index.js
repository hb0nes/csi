'use strict';
const fs = require('fs');

const Hapi = require('hapi');
const Path = require('path');

// Certificate
const privateKey = fs.readFileSync(__dirname + '/ssl/privkey.pem', 'utf8');
const certificate = fs.readFileSync(__dirname + '/ssl/cert.pem', 'utf8');

const server = Hapi.server({
    tls: {
        key: privateKey,
        cert: certificate
    },
    port: 443
});
const start = async () => {

    await server.register(require('inert'));

    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: '../cysedm-webpack/dist'
            }
        }
    });

    await server.start();

    console.log('Server running at:', server.info.uri);
};

start();
