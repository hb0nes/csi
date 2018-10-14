// Models
let db = require('../../models')
// JOI (input validation)
const Joi = require('joi');
// Boom for errors
const Boom = require('boom');
// Ecryption module
const modules = require(__dirname + "/modules/modules.js");

const schemaDelete = Joi.object().keys({
    "id": Joi.string().min(1).required(),
});

module.exports = [
    {
        method: 'DELETE',
        path: '/api/v1/message/delete/{id}',
        config: {
            auth: {
                strategy: 'jwt',
                scope: 'user'
            }
        },
        handler: async (request, h) => {
            try {
                // Verify payload
                const result = Joi.validate(request.params, schemaDelete);
                if (result.error) {
                    return Boom.badRequest(result.error.toString());
                }
                // Check if content is present in Db
                if (!await modules.inDb(request.params.id)) {
                    return Boom.badRequest(`Message: ${request.params.id} not present in Database`);
                }
                // Check if user has admin rights. If so, user user can delete any message
                if (request.auth.credentials.scope.indexOf("admin") === 1) {
                    db.Message.destroy({
                        where: {
                            id: request.params.id
                        }
                    });
                    return h.response(`Message: ${request.params.id} deleted successfully`).code(202);
                }
                // Check if user has ownership of the message
                else if (!await modules.isOwner(request.params.id, request.auth.credentials.username)) {
                    return h.response(`No rights to delete message: ${request.params.id}`).code(404);
                }else{
                    db.Message.destroy({
                        where: {
                            id: request.params.id,
                            sender: request.auth.credentials.username,
                        }
                    })
                    return h.response(`Message: ${request.params.id} deleted successfully`).code(202);
                }
            }
            catch (err) {
                return Boom.badImplementation(`Could not delete message: ${request.params.id}. Error: ${err}`)
            }
        }
    }
]



