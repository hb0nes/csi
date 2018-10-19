//bcrypt for saving pwds
const Bcrypt = require('bcrypt-nodejs')
// Models
const Db = require('../../models')
// JOI (input validation)
const Joi = require('joi');
// Boom for errors
const Boom = require('boom');
// Logging
const l = require('../../logger');

// Validation schema
const regExName = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/
const schema = Joi.object().keys({
    "username": Joi.string().min(2).max(40).alphanum().required(),
    "password": Joi.string().min(8).required(),
    "firstName": Joi.string().min(2).regex(regExName).required(),
    "lastName": Joi.string().min(2).regex(regExName).required(),
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
                l.info(`Username: ${req.payload.username} created succesfully.`);
                return h.response(`Username: ${req.payload.username} created succesfully.`).code(201);
            }
            catch (err) {
                l.error('Creating user failed.',err);
                return Boom.badImplementation(`Creating user failed. ${err}`);
            }
        }
    }
]