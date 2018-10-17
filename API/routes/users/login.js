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
    "username": Joi.string().min(2).max(40).alphanum(),
    "password": Joi.string().min(8).required(),
    "email": Joi.string().email().min(8).max(50)
});

module.exports = [
    // Anyone with an account can login. Either with username or email (and of course a password)
    {
        method: 'POST',
        path: '/api/v1/user/login',
        config: { auth: false },
        handler: async (req, h) => {
            // Default scope
            let scope = ['user'];

            // Validate
            const result = Joi.validate(req.payload, schema);
            if (result.error || (!req.payload.username && !req.payload.email) || !req.payload.password) {
                l.info(`Login attempt failed ${result.error || req.payload.username || req.payload.email}.`);
                return Boom.badRequest(`Login failed. Invalid credentials.`);
            }

            // Check if there is a user with the given name or email
            let Op = Db.Sequelize.Op;
            let user = await Db.User.findOne({
                where: {
                    [Op.or]: [{ "username": req.payload.username }, { "email": req.payload.email }]
                }
            })
            if (!user) {
                l.info(`Login attempt failed for user ${req.payload.username || req.payload.email || 'nobody' }.`);
                return Boom.badRequest(`Login failed. Invalid credentials.`);
            }

            // Compare passwords
            if (Bcrypt.compareSync(req.payload.password, user.password)) {
                if (user.admin) {
                    scope.push('admin');
                }
                // Create token and return it
                let token = Jwt.sign({ "id": user.id, "username": user.username, "scope": scope }, process.env.SECRET, { expiresIn: "15m" });
                l.info(`User ${req.payload.username} has logged in succesfully.`);
                h.state('token', token);
                let loggedIn = {
                    'username:': req.payload.username,
                    'scope': scope
                }
                return h.response(loggedIn).header('Authorization', token).code(200);
            }
            else {
                l.info(`Login attempt failed.`);
                return Boom.badRequest(`Login failed. Invalid credentials.`);
            }
        }
    }
]