'use strict';
exports.plugin = {
    pkg: require('../../../package.json'),
    register: async function (server, options) {
        module.exports = require('socket.io')(server.listener);;
    }
};
