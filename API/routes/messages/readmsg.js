// Models
let db = require('../../models')
// JOI (input validation)
const Joi = require('joi');
// Boom for errors
const Boom = require('boom');

const schema = Joi.object().keys({
    "partner": Joi.string().min(1).alphanum().required(),
});
module.exports = [
    {
        method: 'PUT',
        path: '/api/v1/message/readmsg',
        config: {
            auth: {
                strategy: 'jwt',
                scope: 'user'
            }
        },
        handler: async (request, h) => {
            try {
                // Validate payload
                const result = Joi.validate(request.payload, schema);
                if (result.error) {
                    return Boom.badRequest(result.error.toString());
                }
                const sender = request.payload.partner;
                const receiver = request.auth.credentials.username;

                db.Message.update({ unread: 0 }, {
                    where: {
                        sender: sender,
                        receiver: receiver,
                        unread: 1
                    }
                })
                return h.response(`Successfully read all messages from ${sender} to ${receiver}.`).code(202);
            }
            catch (err) {
                return Boom.badImplementation(`Failed to update 'unread' flag on messages from ${sender} to ${receiver} message. Error: ${err}`)
            }
        }
    }
]

