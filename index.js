// Hapi voor...Hapiness.
const Hapi = require('hapi');
// Environment variabelen
require('dotenv').config();
// Json web token voor authenticatie
let jwt = require('jsonwebtoken');
// Sequelize voor ORM 
var Sequelize = require('sequelize');
var sequelize = new Sequelize(process.env.DB);
//bcrypt voor hashen/opslaan wachtwoorden
var bcrypt = require('bcrypt-nodejs')

// Sequelize Models
const User = sequelize.define('user', {
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    firstName: {
        type: Sequelize.STRING
    },
    lastName: {
        type: Sequelize.STRING
    },
    emailAddress: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }
})
const Message = sequelize.define('message', {
    sender: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    receiver: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    content: {
        type: Sequelize.STRING
    },
    time: {
        type: Sequelize.DATE
    }
});

// Credential validatiefunctie
const validate = async function (decoded, request) {
    // Vind user met ID
    let user = await User.findOne({ where: { id: decoded.id } });
    if (user) {
        return { isValid: true };
    }
    else {
        return { isValid: false };
    }
};

(async () => {
    // Authenticate Sequelize
    try {
        await sequelize.authenticate();
        console.log('Succesfully authenticated.');
    }
    catch (err) {
        console.log('Failed authentication:', err)
    }
    // FOREIGN_KEY_CHECKS=0, anders kan hij tabellen niet weggooien
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { raw: true });

    // Maak de tabellen aan en drop ze als ze nog niet bestaan
    await User.sync({ force: true });
    Message.sync({ force: true });

    // HAPI server
    const server = Hapi.server({
        port: 3000,
        host: '127.0.0.1'
    })
    await server.register(require('hapi-auth-jwt2'));
    await server.start();
    try {
        console.log(`Server running at: ${server.info.uri}`);
    }
    catch (err) {
        console.log("Error:", err)
    }
    server.auth.strategy('jwt', 'jwt',
        {
            key: process.env.SECRET,          // Never Share your secret key
            validate: validate,            // validate function defined above
            verifyOptions: { algorithms: ['HS256'] } // pick a strong algorithm
        });
    server.auth.default('jwt');

    server.route([
        {
            method: 'GET',
            path: '/',
            config: { auth: false },
            handler: (req, h) => {
                return `This is an API. You can reach it on ${server.info.uri}/api/v1/`;
            }
        },
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
                    if (!username || !password || !email) {
                        return h.response('Missing a parameter.').code(400);
                    }
                    // Hash wachtwoord en sla gebruiker op in de DB
                    let hash = bcrypt.hashSync(password);
                    await User.create({
                        username: username,
                        password: hash,
                        firstName: firstName,
                        lastName: lastName,
                        emailAddress: email
                    })
                    return h.response(`Username: ${username} created succesfully.`).code(201);
                }
                catch (err) {
                    return h.response(`Creating user failed. ${err}`).code(500);
                }
            }
        },
        {
            method: 'POST',
            path: '/api/v1/login',
            config: { auth: false },
            handler: async (req, h) => {
                let username = req.payload.username;
                let email = req.payload.email;
                let password = req.payload.password;
                let user;
                if ((!username && !email) || !password) {
                    return h.response(`Login failed. Missing credentials.`).code(400);
                }
                let Op = Sequelize.Op;
                user = await User.findOne({
                    where: {
                        [Op.or]: [{ username: username }, { emailAddress: email }]
                    }
                })
                if (bcrypt.compareSync(password, user.password)) {
                    let token = jwt.sign({ id: user.id, username: user.username }, process.env.SECRET, { expiresIn: "15m" });
                    return h.response(`Authentication Token: ${token}`).code(200);
                }
                else {
                    return h.response(`Login unsuccesful.`).code(401);
                }
            }
        },
        {
            method: 'GET',
            path: '/api/v1/messages',
            config: { auth: 'jwt' },
            handler: (req, h) => {
                return 'You used a token!';
            }
        }
    ])
})();
