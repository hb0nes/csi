//bcrypt for saving pwds
const Bcrypt = require('bcrypt-nodejs')
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
                        // TODO Met eigen domein
                        service: 'gmail',
                        auth: {
                            user: 'cysedm2018@gmail.com',
                            pass: 'Varkens00!'
                        }
                    });

                    let server = process.env.VUE_APP_SERVERNAME;

                    const link = '<a href="'+server+':8080/#/reset/' + payload.id + '/' + token + '">Reset password</a>'
                    const mailOptions = {
                        from: 'CyseDM',
                        sender: 'CyseDM',
                        //to: email,
                        to: 'robertjanbuddenbohmer@gmail.com',
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
                    return h.response('An email has been send to your email').code(200);
                } else {
                    return Boom.badRequest('There is no account with this email address.');

                }
            }
            catch (err) {
                l.error('Sending email failed.', err);
                return Boom.badImplementation(`Sending email failed. ${err}`);
            }
        }
    },
    {
        method: 'POST',
        path: '/api/v1/user/reset',
        config: { auth: false },
        handler: async (req, h) => {
            try {
                const id = req.payload.id;
                let user = await Db.User.findOne({
                    where: {
                        username: id
                    }
                })
                if (user != null) {
                    // En alweer een geheimpje maken...
                    const secret = user.password + "-" + user.created;
                    const payload = jwt.decode(req.payload.token, secret);

                    if (payload.id === id) {
                        const hash = Bcrypt.hashSync(req.payload.password);
                        Db.User.update({ password: hash }, {
                            where: {
                                username: id
                            }
                        })
                        return h.response('Your password is successfully changed').code(202);
                    } else {
                        return Boom.badRequest('There is a problem with your identity');
                    }
                } else {
                    return Boom.badRequest('No account found');
                }
            } catch (err) {
                if (err.message == "Signature verification failed") {
                    return Boom.badRequest('Your reset-link has been expired');
                }

                l.error('Resetting users password failed.', err);
                return Boom.badImplementation(`Reset password failed. ${err}`);
            }
        }
    }

]