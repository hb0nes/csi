const Path = require('path');
const viewsPath = Path.resolve(__dirname, '..');
const layoutPath = Path.resolve(viewsPath, 'layout')
const Handlebars = require('handlebars');

module.exports = 
    {
        engines:{
            html:Handlebars
         },
        isCached:false,
        path:viewsPath,
        layoutPath:layoutPath,
        layout:"layout"
    }