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
const fs = require('fs');



const schema = Joi.object().keys({
    "username": Joi.string().min(2).max(40).alphanum(),
    "password": Joi.string().min(8),
    "firstName": Joi.string().min(2).regex(/^[a-zA-Z]+$/),
    "lastName": Joi.string().min(2).regex(/^[a-zA-Z]+$/),
    "email": Joi.string().email().min(8).max(50)
});

const schema2 = Joi.object().keys({
    "password": Joi.string().min(8),
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
                l.error('Deleting a user has failed.', err);
                return Boom.badImplementation(`Deleting user failed. ${err}`);
            }
        }
    },
    {
        method: 'PUT',
        path: '/api/v1/user/update/{oldPassword}/{newPassword}',
        config: {
            auth: {
                strategy: 'jwt',
                scope: 'admin'
            }
        },
        handler: async (req, h) => {
            /*console.log(req.params.newPassword)
            const result = Joi.validate(req.params.newPassword, schema2);
            if (result.error) {
                l.info(`Failed to change password ${result.error}`);
                return Boom.badRequest(`Changing password failed.`);
            }*/
            let newPw = await Bcrypt.hashSync(req.params.newPassword)
            
            let user = await Db.User.findOne({
                where: {
                    id: req.auth.credentials.id
                }
            })
            if (Bcrypt.compareSync(req.params.oldPassword, user.password)) {
                await Db.User.update({
                    password: newPw
                },
                    {
                        where: {
                            id: req.auth.credentials.id
                        }
                    })
            }
            let token = Jwt.sign({ "id": req.auth.credentials.id, "username": req.auth.credentials.username, "scope": req.auth.credentials.scope },
                process.env.SECRET, { expiresIn: "24h" });
            l.info(`User ${req.auth.credentials.username} Changed password successfully.`);
            h.state('token', token);
            let loggedIn = {
                'username': req.auth.credentials.username,
                'scope': req.auth.credentials.scope
            }
            return h.response(loggedIn).header('Authorization', token).code(200);
        }
    },
    {
        method: 'POST',
        path: '/api/v1/user/updateAvatar',
        config: {      
            auth: {
                strategy: 'jwt',
                scope: 'admin'
            },
            payload: {
                output: 'stream',
                allow: 'multipart/form-data' // important
            }
        },
        handler: async (req) => {
            try {
                console.log(req.payload)
                await Db.User.update({
                    avatar: req.payload.image.hapi.headers
                },
                    {
                        where: {
                            id: req.auth.credentials.id
                        }
                    })
            }
            catch (err) {
                console.log('Failed to upload image: ' + (err))
            }
            return "complete"
        }
    }
]