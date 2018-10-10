module.exports = [
    {
      method: 'GET',
      path: '/register',
      handler: function (request, reply) {
        return reply.view('register');
      }
    }]