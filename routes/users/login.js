// bcrypt voor hashen/opslaan wachtwoorden
var bcrypt = require('bcrypt-nodejs')
// Json web token voor authenticatie
let jwt = require('jsonwebtoken');
// Models
let db = require('../../models')
// Environment Variables
require('dotenv').config();



module.exports = [
    // Iedereen mag inloggen
    {
        method: 'POST',
        path: '/api/v1/login',
        config: { auth: false },
        handler: async (req, h) => {
            // Variabelen
            let username = req.payload.username;
            let email = req.payload.email;
            let password = req.payload.password;
            let user;
            // Default scope
            let scope = ['user'];
            if ((!username && !email) || !password) {
                return h.response(`Login failed. Missing credentials.`).code(400);
            }

            // Kijk of er een gebruiker is met een opgegeven username of email
            // Op is een Sequelize functie om operators te gebruiken zoals 'or', in dit geval
            let Op = db.Sequelize.Op;
            user = await db.User.findOne({
                where: {
                    [Op.or]: [{ username: username }, { emailAddress: email }]
                }
            })
            // Gebruik bcrypt om het opgegeven wachtwoord te vergelijken met die in de database
            if (bcrypt.compareSync(password, user.password)) {
                // Als de admin flag true is in de database, dan heeft hij of zij toegang tot de admin scope
                if (user.admin) {
                    scope.push('admin');
                }
                // Maak een token met de juiste id, username en scope, die verloopt in 15 min en geef hem terug aan de gebruiker
                let token = jwt.sign({ id: user.id, username: user.username, scope: scope }, process.env.SECRET, { expiresIn: "15m" });
                return h.response(`Authentication Token: ${token}`).code(200);
            }
            else {
                return h.response(`Login unsuccesful.`).code(401);
            }
        }
    }
]