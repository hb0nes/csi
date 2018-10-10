// Models
const Db = require('../../models');
// Validation
const Joi = require('joi');
// Error messages
const Boom = require('boom');

module.exports = [
    {
        // Expects either a username alone or an added specific property/field. Multiple fields, multiple calls.
        method: 'GET',
        path: '/api/v1/user/{username}/{field?}',
        config: {
            auth: {
                strategy: 'jwt',
                scope: 'user'
            }
        },
        handler: async (req, h) => {
            try {
                let attributes = [];
                let result;
                if (req.params.field) {
                    if (req.params.field.toLowerCase() === "password") {
                        return Boom.badRequest("Cannot request password.");
                    }
                    attributes.push(req.params.field);
                    result = await Db.User.findOne({
                        attributes: attributes,
                        where: {
                            username: req.params.username
                        }
                    })
                } else {
                    result = await Db.User.findOne({
                        attributes: { exclude: ["password"] },
                        where: {
                            username: req.params.username
                        }
                    })
                }
                return h.response(result).code(200);
            }
            catch (err) {
                return Boom.badImplementation(`Getting user failed. ${err}`);
            }
        }
    }
]