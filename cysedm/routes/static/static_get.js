
const Path = require('path');
var publicPath = Path.resolve(__dirname, '../../public');
module.exports = [
    {
        method: "GET",
        path: "/{path*}",
        handler: {
            directory: {
                path: publicPath,
                listing: false,
                index: false
            }
    }  }]