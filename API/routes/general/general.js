module.exports = [
    // De auth:false zorgt ervoor dat iedereen bij dit bericht kan
    {
        method: 'GET',
        path: '/',
        config: { auth: false },
        handler: (req, h) => {
            return `This is an API. I just changed this and it automatically deployed after a push.`;
        }
    }
]