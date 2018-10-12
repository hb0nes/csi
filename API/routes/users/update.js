// Models
const Db = require('../../models');
// Validation
const Joi = require('joi');
// Error messages
const Boom = require('boom');
//Bcrypt voor hashen/opslaan wachtwoorden
const Bcrypt = require('bcrypt-nodejs')
// Logging
const l = require('../../logger');

const schema = Joi.object().keys({
    "username": Joi.string().min(2).max(40).alphanum(),
    "password": Joi.string().min(8),
    "firstName": Joi.string().min(2).regex(/^[a-zA-Z]+$/),
    "lastName": Joi.string().min(2).regex(/^[a-zA-Z]+$/),
    "email": Joi.string().email().min(8).max(50)
});

module.exports = [
    {
        // Expects a JSON object as a request and validates it. Needs proper fields!
        // Either a user changes their own properties, or an admin does this for them.
        method: 'PUT',
        path: '/api/v1/user/{username}',
        config: {
            auth: {
                strategy: 'jwt',
                scope: 'user'
            }
        },
        handler: async (req, h) => {
            try {
                // Validate the input
                const result = Joi.validate(req.payload, schema);
                if (result.error) {
                    return Boom.badRequest(result.error.toString());
                }
                // If you're not changing your own settings or you aren't an admin then you're not authorized.
                if (req.auth.credentials.username !== req.params.username 
                    && req.auth.credentials.scope.indexOf("admin") === -1) {
                    return Boom.unauthorized("Unauthorized user.");
                }
                // user wants to change password, must store it hashed again
                if (req.payload.password) {
                    var hash = Bcrypt.hashSync(req.payload.password);
                    req.payload.password = hash;
                }
                // Update the user. Format of payload is important
                Db.User.update(req.payload, {
                    where: {
                        username: req.params.username
                    }
                })
                l.info(`User ${req.params.username} updated succesfully.`);
                return h.response(`User ${req.params.username} updated succesfully.`).code(202);
            }
            catch (err) {
                l.error('Deleting a user has failed.',err);
                return Boom.badImplementation(`Deleting user failed. ${err}`);
            }
        }
    }
]