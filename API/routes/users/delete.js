// Models
const Db = require('../../models')
// Boom for errors
const Boom = require('boom');

module.exports = [
    // Admin function, deletes based on username
    {
        method: 'DELETE',
        path: '/api/v1/user/{username}',
        config: {
            auth: {
                strategy: 'jwt',
                scope: 'admin'
            }
        },
        handler: async (req, h) => {
            try {
                await Db.User.destroy({
                    where: { username: req.params.username}
                })
                return h.response(`Username: ${req.params.username} deleted succesfully.`).code(202);
            }
            catch (err) {
                return Boom.badImplementation(`Deleting user failed. ${err}`).code(500);
            }
        }
    }
]