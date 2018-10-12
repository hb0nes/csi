module.exports = [
    // De auth:false zorgt ervoor dat iedereen bij dit bericht kan
    {
        method: 'GET',
        path: '/',
        config: { auth: false },
        handler: (req, h) => {
            return `This is an API. I just changed this and it automatically deployed after a push.`;
        }
    },
    {
        method: 'GET',
        path: '/.well-known/acme-challenge/2JXo-MBE4FpdPZyXDCHSXM-HcK-Thss7K6zn6qSgidM',
        config: { auth: false },
        handler: (req, h) => {
            return `2JXo-MBE4FpdPZyXDCHSXM-HcK-Thss7K6zn6qSgidM.JBbOcQ42AkoEclpPmsNjkB2Kt0v_OzdDs7SGMr8BFAo`;
        }
    }
]