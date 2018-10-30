//bcrypt for saving pwds
//const Bcrypt = require('bcrypt-nodejs')
// Models
const Db = require('../../models')
// Boom for errors
const Boom = require('boom');
// Logging
const l = require('../../logger');
// Mailer
const nodemailer = require('nodemailer');
// JWT simpel, even kijken of dit met dezelfde JWT kan als die bij de login wordt gebruikt
const jwt = require('jwt-simple');

module.exports = [
    {

        method: 'POST',
        path: '/api/v1/user/resetpassword',
        config: { auth: false },
        handler: async (req, h) => {
            try {
                const email = req.payload.email;
                let user = await Db.User.findOne({
                    where: {
                        email: email
                    }
                })
                if (user != null) {
                    const payload = {
                        id: user.username,
                        email: email
                    };
                    // Geheimpje maken...
                    const secret = user.password + "-" + user.created;
                    const token = jwt.encode(payload, secret);

                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'cysedm2018@gmail.com',
                            // Dit moet natuurlijk wel ff anders...
                            pass: 'Varkens00!'
                        }
                    });

                    const link = '<a href="http://localhost:8080/reset/' + payload.id + '/' + token + '">Reset password</a>'
                    const mailOptions = {
                        from: 'CyseDM',
                        sender: 'CyseDM',
                        to: email,
                        //to: 'robertjanbuddenbohmer@gmail.com',
                        subject: 'Reset password',
                        html: link
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });

                    // TODO geen bad request
                    return h.response('An email has been send to your varkensemail').code(200);
                } else {
                    return Boom.badRequest('There is no account with this email address. Varken!');

                }
            }
            catch (err) {
                l.error('Resetting users password failed.', err);
                return Boom.badImplementation(`Reset user failed. ${err}`);
            }
        }
    },
    {
        method: 'GET',
        path: '/api/v1/user/reset/{id}/{token}',
        config: { auth: false },
        handler: async (req, h) => {
            try {
                console.log(req.params.id);
                const secret = user.password + "-" + user.created;
                const payload = jwt.decode(req.params.token, secret);
                return Boom.badRequest('Varken!');
            } catch (err) {
                l.error('Resetting users password failed.', err);
                return Boom.badImplementation(`Reset user failed. ${err}`);
            }
        }
    }

]