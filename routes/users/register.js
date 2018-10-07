//bcrypt voor hashen/opslaan wachtwoorden
var bcrypt = require('bcrypt-nodejs')
// Models
let db = require('../../models')

module.exports = [
    // Iedereen mag een gebruiker aanmaken
    {
        method: 'POST',
        path: '/api/v1/createUser',
        config: { auth: false },
        handler: async (req, h) => {
            try {
                // Haal credentials uit de payload
                let payload = req.payload;
                console.log(payload)
                let username = payload.username;
                let password = payload.password;
                let firstName = payload.firstName;
                let lastName = payload.lastName;
                let email = payload.email;
                let admin = false;
                if (!username || !password || !email) {
                    return h.response('Missing a parameter.').code(400);
                }

                // Check for admin-rights
                let admins = ["b0nes", "budroid", "epicfail"];
                if (admins.indexOf(username.toLowerCase()) !== -1) {
                    admin = true;
                }

                // Hash wachtwoord en sla gebruiker op in de DB
                let hash = bcrypt.hashSync(password);
                await db.User.create({
                    username: username,
                    password: hash,
                    firstName: firstName,
                    lastName: lastName,
                    emailAddress: email,
                    admin: admin
                })
                return h.response(`Username: ${username} created succesfully.`).code(201);
            }
            catch (err) {
                return h.response(`Creating user failed. ${err}`).code(500);
            }
        }
    }
]