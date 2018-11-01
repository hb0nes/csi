// bcrypt for saving passwords
const Bcrypt = require('bcrypt-nodejs')
// Json web token for authentication
const Jwt = require('jsonwebtoken');
// Models
const Db = require('../../models')
// Validation
const Joi = require('joi');
// Boom for errors
const Boom = require('boom');
// Logging
const l = require('../../logger');
// Environment Variables
require('dotenv').config();

// Validation schema
const schema = Joi.object().keys({
    "password": Joi.string().min(8).required(),
});

module.exports = [
    // Check if given 'oldPassword' corresponds with stored password in database. If so, update current password. 
    {
        method: 'PUT',
        path: '/api/v1/user/login/{oldPassword}/{newPassword}',
        config: { auth: false },
        handler: async (req, h) => {
            // Validate
            let oldPw = Bcrypt.hashSync(req.params.oldPassword);
            let newPw = Bcrypt.hashSync(req.params.newPassword);
            const result = Joi.validate(req.payload, schema);
            if (result.error || !req.payload.password) {
                l.info(`Failed to change password ${result.error}`);
                return Boom.badRequest(`Changing password failed.`);
            }
            // Check if there is a user with the given name or email
            if (await Db.User.findOne({ attributes: ['password'], where: { id: req.auth.credentials.id } }) === oldPw) {
                await Db.User.update({
                    password: newPw
                })
            }
            let token = Jwt.sign({ "id": req.auth.credentials.id, "username": req.auth.credentials.username, "scope": scope }, 
                process.env.SECRET, { expiresIn: "24h" });
            l.info(`User ${req.auth.credentials.username} Changed password successfully.`);
            h.state('token', token);
            let loggedIn = {
                'username': user.username,
                'scope': scope
            }
            return h.response(loggedIn).header('Authorization', token).code(200);
        }
    }
]