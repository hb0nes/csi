module.exports = [
    // De auth:false zorgt ervoor dat iedereen bij dit bericht kan
    {
        method: 'GET',
        path: '/{sender}/{receiver}',
        config: { auth: false },
        handler: (req, h) => {
            return `This is an API. You can reach it on ${req.server.info.uri}/api/v1/`;
        }
    }
]