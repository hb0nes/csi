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
                SELECT username as partner, firstName, lastName, status, avatar, SUM(CASE WHEN unread=1 and m.receiver = ? THEN 1 ELSE 0 END) as unread
                FROM Users u, Messages m
                WHERE
                    (u.username = m.sender AND m.receiver = ?)
                OR
                    (u.username = m.receiver AND m.sender = ?)
                GROUP BY username
                ORDER BY max(createdAt) DESC`, { replacements: [username,username,username], type: db.sequelize.QueryTypes.SELECT});
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


