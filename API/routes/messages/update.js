// Models
let db = require('../../models')
// JOI (input validation)
const Joi = require('joi');
// Boom for errors
const Boom = require('boom');
// Ecryption module
const modules = require(__dirname + "/modules/modules.js");

const schemaUpdate = Joi.object().keys({
    "id": Joi.string().min(1).required(),
    "content": Joi.string().min(1).required(),
});
module.exports = [
    {
        method: 'PUT',
        path: '/api/v1/message/update',
        config: {
            auth: {
                strategy: 'jwt',
                scope: 'user'
            }
        },
        handler: async (request, h) => {
            try {
                // Validate payload
                const result = Joi.validate(request.payload, schemaUpdate);
                if (result.error) {
                    return Boom.badRequest(result.error.toString());
                }
                // Check if user has ownership of message
                if (await modules.isOwner(request.payload.id, request.auth.credentials.username)) {
                    // Encrypt new content before insertion into DB
                    let content = await modules.encrypt(request.payload.content)
                    await db.Message.update({
                        content: content
                    },
                    {
                        where: {
                            id: request.payload.id,
                            sender: request.auth.credentials.username
                        }
                    })
                    return h.response(`Message ${request.payload.id} updated succesfully`).code(202);
                } else {
                    return h.response(`No rights to update message: ${request.payload.id}`).code(403);
                }
            }
            catch (err) {
                return Boom.badImplementation(`Failed to update message. Error: ${err}`)
            }
        }
    }
]

