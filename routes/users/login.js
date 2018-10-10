// bcrypt voor hashen/opslaan wachtwoorden
var Bcrypt = require('bcrypt-nodejs')
// Json web token voor authenticatie
let Jwt = require('jsonwebtoken');
// Models
let Db = require('../../models')
// Validation
const Joi = require('joi');
// Environment Variables
require('dotenv').config();

// Validatieschema
const schema = Joi.object().keys({
    "username": Joi.string().min(2).max(40).alphanum(),
    "password": Joi.string().min(8).required(),
    "email": Joi.string().email().min(8).max(50)
});

module.exports = [
    // Iedereen mag inloggen
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
                return h.response(`Login failed. Invalid credentials.`).code(401);
            }

            // Kijk of er een gebruiker is met een opgegeven username of email
            // Op is een Sequelize functie om operators te gebruiken zoals 'or', in dit geval
            let Op = Db.Sequelize.Op;
            let user = await Db.User.findOne({
                where: {
                    [Op.or]: [{ "username": req.payload.username }, { "emailAddress": req.payload.email }]
                }
            })
            // Gebruik Bcrypt om het opgegeven wachtwoord te vergelijken met die in de database
            if (Bcrypt.compareSync(req.payload.password, user.password)) {
                // Als de admin flag true is in de database, dan heeft hij of zij toegang tot de admin scope
                if (user.admin) {
                    scope.push('admin');
                }
                // Maak een token met de juiste id, username en scope, die verloopt in 15 min en geef hem terug aan de gebruiker
                let token = Jwt.sign({ "id": user.id, "username": user.username, "scope": scope }, process.env.SECRET, { expiresIn: "15m" });
                return h.response(`Authentication Token: ${token}`).code(200);
            }
            else {
                return h.response(`Login failed. Invalid credentials.`).code(401);
            }
        }
    }
]