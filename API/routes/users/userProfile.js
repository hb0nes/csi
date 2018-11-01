// Models
const Db = require('../../models');
// Error messages
const Boom = require('boom');

module.exports = [
    {
        method: 'GET',
        path: '/api/v1/user/profile',
        config: {
            auth: {
                strategy: 'jwt',
                scope: 'user'
            }
        },
        handler: async (req, h) => {
            try {
                // Search for a user by username or email
                let result = await Db.User.findOne({
                    attributes: ['firstName', 'lastName', 'status', 'avatar'],
                    where: {
                        id: req.auth.credentials.id
                    },                   
                })
                if (!result) {
                    return Boom.badRequest('No results found.');
                }
                return h.response(result).code(200);         
            } catch (err) {
                return Boom.badImplementation(`Could not load users. Error: ${err}`)
            }
        }
    }
]