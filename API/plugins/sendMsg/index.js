'use strict';

exports.plugin = {
    pkg: require('../../../package.json'),
    register: async function (server, options) {
        var io = require('socket.io')(server.listener);
        server.route({
            config: { auth: false },
            method: 'GET',
            path: '/test/{fire?}',
            handler: function (request, h) {
                io.emit('test', `testdata: ${request.params.fire}`);
                return `Test tried, motherfucker! Param: ${request.params.fire}`;
            }
        });
    }
};