// Models
let db = require('../../models')
// Error messages
const Boom = require('boom');

module.exports = [
    {
        method: 'GET',
        path: '/api/v1/message/conversations',
        config: {
            auth: {
                strategy: 'jwt',
                scope: 'user'
            }
        },
        handler: async (request, h) => {
            try {
                conversations = [];
                // Find all messages to/from user/'partner'
                let username = request.auth.credentials.username;
                let results = await db.sequelize.query(`
                    SELECT DISTINCT(receiver) AS conversation
                    FROM messages
                    WHERE sender = ?
                    UNION 
                    SELECT DISTINCT(sender) as conversation
                    FROM messages
                    WHERE receiver = ?;`, { replacements: [username,username], type: db.sequelize.QueryTypes.SELECT});
                if (!results) {
                    return h.response(conversations).code(200);              
                }
                results.forEach((result) => {
                    conversations.push(result.conversation);
                })
                return h.response(conversations).code(200);              
            } catch (err) {
                return Boom.badImplementation(`Could not load conversations. Error: ${err}`)
            }          
        }
    }
]



