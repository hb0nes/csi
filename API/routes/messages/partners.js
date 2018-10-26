// Models
let db = require('../../models')
// Error messages
const Boom = require('boom');

module.exports = [
    {
        method: 'GET',
        path: '/api/v1/message/partners',
        config: {
            auth: {
                strategy: 'jwt',
                scope: 'user'
            }
        },
        handler: async (request, h) => {
            try {
                partners = [];
                // Find all messages to/from user/'partner'
                let username = request.auth.credentials.username;
                let results = await db.sequelize.query(`
                SELECT DISTINCT username as partner, firstName, lastName, status, avatar
                FROM Users u, Messages m
                WHERE
                    (u.username = m.sender AND m.receiver = ?)
                OR
                    (u.username = m.receiver AND m.sender = ?)
                ORDER BY createdAt DESC`, { replacements: [username,username], type: db.sequelize.QueryTypes.SELECT});
                if (!results) {
                    return h.response(partners).code(200);              
                }
                return h.response(results).code(200);              
            } catch (err) {
                return Boom.badImplementation(`Could not load partners. Error: ${err}`)
            }
        }
    }
]


