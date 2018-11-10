// Models
const Db = require('../../models');
// Validation
const Joi = require('joi');
// Error messages
const Boom = require('boom');
// Logging
const l = require('../../logger');

module.exports = [
    {
        // Expects either a username alone or an added specific property/field. Multiple fields, multiple calls.
        method: 'GET',
        path: '/api/v1/user/read',
        config: {
            auth: {
                strategy: 'jwt',
                scope: 'user'
            },
        },
        handler: async (req, h) => {
            try {
                let result = await Db.User.findOne({
                    attributes: ['firstName', 'lastName', 'status','avatar'],
                    where: {
                        id: req.auth.credentials.id
                    },
                })
                //let blob = new Blob(result.avatar.image)
                console.log(result.avatar)
                if (!result) {
                    return Boom.badRequest('No results found.');
                }

                return h.response(result).code(200);
            } catch (err) {
                return Boom.badImplementation(`Could not load users. Error: ${err}`)
            }
        },

    }
]