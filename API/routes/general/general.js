module.exports = [
    // De auth:false zorgt ervoor dat iedereen bij dit bericht kan
    {
        method: 'GET',
        path: '/',
        config: { auth: false },
        handler: (req, h) => {
            return `This is an API.`;
        }
    }
]