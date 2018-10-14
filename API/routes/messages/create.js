// Models
let db = require('../../models');
// JOI (input validation)
const Joi = require('joi');
// Boom for errors
const Boom = require('boom');
// Ecryption module
const modules = require(__dirname + "/modules/modules.js");

const schemaCreate = Joi.object().keys({
    "receiver": Joi.string().min(2).max(40).alphanum().required(),
    "content": Joi.string().min(1).required(),
});

module.exports = [
    {
        method: 'POST',
        path: '/api/v1/message/create',
        config: {
            auth: {
                strategy: 'jwt',
                scope: 'user'
            }
        },
        handler: async (request, h) => {
            try {
                // Validate against schema
                const result = Joi.validate(request.payload, schemaCreate);
                if (result.error) {
                    return Boom.badRequest(result.error.toString());
                }
                if (request.auth.credentials.username != request.payload.receiver) {
                    await db.Message.create({
                        // Get sender ID from JWT token after validation
                        sender: request.auth.credentials.username,
                        receiver: request.payload.receiver,
                        // Encrypt content before insertion
                        content: await modules.encrypt(request.payload.content),
                    });
                    return h.response('Message posted succesfully').code(201);
                }
                else {
                    return Boom.badRequest('Invalid post');
                }
            }
            catch (err) {
                return Boom.badImplementation(`${err}`);
            }
        }
    },
]