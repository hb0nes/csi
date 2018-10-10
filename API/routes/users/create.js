//bcrypt for saving pwds
const Bcrypt = require('bcrypt-nodejs')
// Models
const Db = require('../../models')
// JOI (input validation)
const Joi = require('joi');
// Boom for errors
const Boom = require('boom');

// Validation schema
const schema = Joi.object().keys({
    "username": Joi.string().min(2).max(40).alphanum().required(),
    "password": Joi.string().min(8).required(),
    "firstName": Joi.string().min(2).regex(/^[a-zA-Z]+$/).required(),
    "lastName": Joi.string().min(2).regex(/^[a-zA-Z]+$/).required(),
    "email": Joi.string().email().min(8).max(50).required()
});

module.exports = [
    {

        method: 'POST',
        path: '/api/v1/user/create',
        config: { auth: false },
        handler: async (req, h) => {
            try {
                // Validate against schema
                const result = Joi.validate(req.payload, schema);
                if (result.error) {
                    return Boom.badRequest(result.error.toString());
                }

                // Check for admin-rights
                let admin = false;
                let admins = ["b0nes", "budroid", "epicfail"];
                if (admins.indexOf(req.payload.username.toLowerCase().trim()) !== -1) {
                    admin = true;
                }

                // Hash pwd and save in DB
                let hash = Bcrypt.hashSync(req.payload.password);
                await Db.User.create({
                    "username": req.payload.username,
                    "password": hash,
                    "firstName": req.payload.firstName,
                    "lastName": req.payload.lastName,
                    "email": req.payload.email,
                    "admin": admin
                })
                return h.response(`Username: ${req.payload.username} created succesfully.`).code(201);
            }
            catch (err) {
                return Boom.badImplementation(`Creating user failed. ${err}`);
            }
        }
    }
]