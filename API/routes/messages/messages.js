// Models
let db = require('../../models')
// Json web token voor authenticatie
let jwt = require('jsonwebtoken');

module.exports = [
    {
        method: 'POST',
        path: '/api/v1/message/create',
        /*config: {
            auth: {
                strategy: 'jwt',
                scope: 'user'
            }
        },*/
        config: { auth: false },
        handler: async (req, h) => {
            try {
                await db.Message.create({
                    sender: req.payload.sender,
                    receiver: req.payload.receiver,
                    content: req.payload.content,
                })
                if (!req.payload.content) {
                    return h.response('Post failed: Fill the required fields');
                }
                else {
                    return h.response('Message posted succesfully');
                }
            }
            catch (err) {
                return h.response(`${err}`);
            }
        }
    },
    {

        method: 'GET',
        path: '/api/v1/message/load',
        config: {
            auth: {
                strategy: 'jwt',
                scope: 'user'
            }
        },
        //config: { auth: false },
        handler: async (request, h) => {
            try {
                console.log(request.auth.credentials)
                let user = request.auth.credentials.id;
                let results = []
                let Op = db.Sequelize.Op;
                let messages = await db.Message.findAll({
                    where: {
                        [Op.or]: [{ sender: user }, { receiver: user }]
                    }
                })
                messages.forEach((result) => {
                    results.push({
                        "sender": result.get('sender'), "receiver": result.get('receiver'),
                        "content": result.get('content')
                    })
                })
                return results;

            } catch (err) {
                return h.response(`Could not load messages. Error: ${err}`)
            }
        }
    }
]


/*,
    {
        method: 'PUT',
        path: '/message/update',
        config: { auth: false },
        handler: async (req, h) => {
            // Variabelen
        }
    },
    {
        method: '',
        path: '/message/delete',
        config: { auth: false },
        handler: async (req, h) => {
            // Variabelen
            await db.Message.create({
                sender: req.payload.sender,
                receiver: req.payload.receiver,
                content: req.payload.content,
            })
        }
    }*/
