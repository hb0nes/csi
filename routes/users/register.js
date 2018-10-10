//bcrypt voor hashen/opslaan wachtwoorden
const Bcrypt = require('bcrypt-nodejs')
// Models
const Db = require('../../models')
// JOI (input validation)
const Joi = require('joi');

// Validatieschema
const schema = Joi.object().keys({
    "username": Joi.string().min(2).max(40).alphanum().required(),
    "password": Joi.string().min(8).required(),
    "firstName": Joi.string().min(2).regex(/^[a-zA-Z]+$/).required(),
    "lastName": Joi.string().min(2).regex(/^[a-zA-Z]+$/).required(),
    "email": Joi.string().email().min(8).max(50).required()
});

module.exports = [
    // Iedereen mag een gebruiker aanmaken
    {
        method: 'POST',
        path: '/api/v1/user/create',
        config: { auth: false },
        handler: async (req, h) => {
            try {
                // Validate against schema
                const result = Joi.validate(req.payload, schema);
                if (result.error) {
                    return h.response(result.error.toString()).code(422);
                }

                // Check for admin-rights
                let admin = false;
                let admins = ["b0nes", "budroid", "epicfail"];
                if (admins.indexOf(req.payload.username.toLowerCase()) !== -1) {
                    admin = true;
                }

                // Hash pwd and save in DB
                let hash = Bcrypt.hashSync(req.payload.password);
                await Db.User.create({
                    "username": req.payload.username,
                    "password": hash,
                    "firstName": req.payload.firstName,
                    "lastName": req.payload.lastName,
                    "emailAddress": req.payload.email,
                    "admin": req.payload.admin
                })
                return h.response(`Username: ${req.payload.username} created succesfully.`).code(201);
            }
            catch (err) {
                return h.response(`Creating user failed. ${err}`).code(500);
            }
        }
    }
]