// Hapi for...Hapiness.
const Hapi = require('hapi');
const server = Hapi.server({
    port: 3000,
    host: '127.0.0.1'
})
// Sequelize for ORM 
var Sequelize = require('sequelize');
var sequelize = new Sequelize('mysql://root:poep1234@localhost:3306/csi');
//bcrypt for storing pwd's
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
(async () => {
    // Authenticate Sequelize
    try {
        await sequelize.authenticate();
        console.log('Succesfully authenticated.');
    }
    catch (err) {
        console.log('Failed authentication:', err)
    }
    // foreign key checks uit anders kan hij tabellen niet weggooien
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { raw: true });
    await User.sync({ force: true });
    Message.sync({ force: true });

    // Start HAPI server
    await server.start();
    try {
        console.log(`Server running at: ${server.info.uri}`);
    }
    catch (err) {
        console.log("Error:", err)
    }

    server.route([
        {
            method: 'GET',
            path: '/',
            handler: (req, h) => {
                return 'This is an API. You can reach it on :8080/api/v1/';
            }
        },
        {
            method: 'POST',
            path: '/api/v1/createUser/{username}/{password}',
            handler: async (req, h) => {
                try {
                    let hash = bcrypt.hashSync(req.params.password);
                    let user = req.params.username;
                    await User.create({ username: user, password: hash })
                    return h.response(`Username: ${user} created succesfully.`).code(201);
                }
                catch (err){
                    return h.response(`Creating user failed. ${err}`).code(500);
                }
            }
        },
        {
            method: 'GET',
            path: '/api/v1/messages',
            handler: (req, h) => {
                return '';
            }
        }
    ])
})();