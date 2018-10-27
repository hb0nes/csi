'use strict';

const Hapi = require('hapi');
const Path = require('path');
const server = Hapi.server({
    port: 80
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