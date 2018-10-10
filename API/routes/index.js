const fs = require('fs');

let routes = [];

fs.readdirSync(__dirname)
    .filter(directory => directory != 'index.js')
    .forEach(directory => {
        fs.readdirSync(__dirname + `/${directory}`)
            .forEach(file => {
                var reqFile = require(`./${directory}/${file}`);
                routes = routes.concat(reqFile);
            })
    });
module.exports = routes;

