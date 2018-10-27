'use strict';
const fs = require('fs');

const Hapi = require('hapi');
const Path = require('path');

// Certificate
const privateKey = fs.readFileSync(__dirname + '/ssl/privkey.pem', 'utf8');
const certificate = fs.readFileSync(__dirname + '/ssl/cert.pem', 'utf8');

const http = Hapi.server(80);


const server = Hapi.server({
    tls: {
        key: privateKey,
        cert: certificate
    },
    port: 443
});

const start = async () => {

    await server.register(require('inert'));
    await http.register({
        register: require('hapi-gate'),
        options: {
            https: true,
            www: true
        }
    });
    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: '../cysedm-webpack/dist'
            }
        }
    });
    await http.start();
    await server.start();

    console.log('Server running at:', server.info.uri);
};

start();
