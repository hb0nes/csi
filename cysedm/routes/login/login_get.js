module.exports = [
    {
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
          return reply.view('login', {title:"Login"});
        }
    }]