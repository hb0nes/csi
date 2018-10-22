// Logging
const l = require('../../logger');

module.exports = [
    {
        // This function validates the cookie versus the current localstorage values. If they aren't coherent... It's no good.
        // Even if they have a valid cookie, they shouldn't see admin functions in the front-end by tampering with the localStorage.
        method: 'GET',
        path: '/api/v1/user/unstate',
        config: { auth: false },
        handler: async (req, h) => {
            try {
                return h.response('Bye').unstate('token').code(200);
            }
            catch (err) {
                l.error('User unstating failed.', err);
                return h.response('Bye').unstate('token').code(500);
            }
        }
    }
]