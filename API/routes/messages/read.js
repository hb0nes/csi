// Models
let db = require('../../models')
// Ecryption module
const modules = require(__dirname + "/modules/modules.js");
// Error messages
const Boom = require('boom');

module.exports = [
    {
        method: 'GET',
        path: '/api/v1/message/read/{partner}',
        config: {
            auth: {
                strategy: 'jwt',
                scope: 'user'
            }
        },
        handler: async (request, h) => {
            try {
                let results = []
                let Op = db.Sequelize.Op;
                // Find all messages to/from user/'partner'
                let messages = await db.Message.findAll({
                    where: {
                        [Op.or]: [
                            { [Op.and]: [{ sender: request.auth.credentials.username }, { receiver: request.params.partner }] },
                            { [Op.and]: [{ sender: request.params.partner }, { receiver: request.auth.credentials.username }] }
                        ]
                    },
                    order: db.Sequelize.col('createdAt')                   
                })
                messages.forEach(async (result) => {
                    // Decrypt content from db
                    let content = await modules.decrypt(result.get('content'))
                    results.push({
                        "sender": result.get('sender'), "receiver": result.get('receiver'),
                        "content": content, "datetime": result.get('createdAt')
                    })
                })
                return h.response(`Messages loaded successfully.`).code(200);              
            } catch (err) {
                return Boom.badImplementation(`Could not load messages. Error: ${err}`)
            }          
        }
    }
]



