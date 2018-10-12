const Hapi = require('hapi');
const Vision = require('vision');
const Inert = require('inert');
const routes = require('./routes');
const viewconfig = require('./views/viewconfig');

const server = new Hapi.Server({
    port: 8080
});

const provision = async () => {

  // Vision registeren voor dynamiche html serven en Inert voor static shizzle (CSS)
  await server.register([Vision, Inert]);

  // De server voorzien van view configuratie 
  server.views(viewconfig);
  
  // En van routes
  server.route(routes);
  
  // Server starten
  await server.start();
  l.info('Server running at:', server.info.uri);
};

provision();