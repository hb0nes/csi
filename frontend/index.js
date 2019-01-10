// Add this to the VERY top of the first file loaded in your app
const apm = require('elastic-apm-node').start({
    // Override service name from package.json
    // Allowed characters: a-z, A-Z, 0-9, -, _, and space
    serviceName: 'cysedm',
  
    // Use if APM Server requires a token
    // secretToken: '',
  
    // Set custom APM Server URL (default: http://localhost:8200)
    //serverUrl: '',
  })
'use strict';
const fs = require('fs');

const Hapi = require('hapi');
const Path = require('path');

// Certificate
const privateKey = fs.readFileSync(__dirname + '/ssl/privkey.pem', 'utf8');
const certificate = fs.readFileSync(__dirname + '/ssl/cert.pem', 'utf8');

const http = Hapi.server({
    port: 80
});


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
        plugin: require('hapi-gate'),
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
