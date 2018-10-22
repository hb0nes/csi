// Error messages
const Boom = require('boom');
// Logging
const l = require('../../logger');

module.exports = [
    {
        // This function validates the cookie versus the current localstorage values. If they aren't coherent... It's no good.
        // Even if they have a valid cookie, they shouldn't see admin functions in the front-end by tampering with the localStorage.
        method: 'POST',
        path: '/api/v1/user/validate',
        config: {
            auth: {
                strategy: 'jwt',
                scope: 'user'
            }
        },
        handler: async (req, h) => {
            try {
                let user = req.payload.user
                if (user.username && user.scope) {
                    if (
                        user.username !== req.auth.credentials.username ||
                        JSON.stringify(user.scope) !== JSON.stringify(req.auth.credentials.scope)
                    ) {
                    return Boom.unauthorized('What?.');
                    }
                } else {
                    return Boom.unauthorized('What?');
                }
                return 'Successfully validated.'
            }
            catch (err) {
                l.error('User validation failed. Someone been tampering with the localStorage @ frontend?', err);
                return Boom.unauthorized('Something went wrong on the server.')
            }
        }
    }
]