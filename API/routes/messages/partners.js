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
                SELECT partners.*, u.firstName, u.lastName, u.status, u.avatar
                FROM
                (
                    SELECT DISTINCT(receiver) AS partner
                    FROM Messages
                    WHERE sender = ?
                    UNION 
                    SELECT DISTINCT(sender) as partner
                    FROM Messages
                    WHERE receiver = ?
                ) partners
                INNER JOIN Users u
                ON partners.partner = u.username;`, { replacements: [username,username], type: db.sequelize.QueryTypes.SELECT});
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


