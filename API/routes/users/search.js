// Models
const Db = require('../../models');
// Error messages
const Boom = require('boom');

module.exports = [
    {
        method: 'GET',
        path: '/api/v1/user/list/{name?}',
        config: {
            auth: {
                strategy: 'jwt',
                scope: 'user'
            }
        },
        handler: async (req, h) => {
            try {
                const Op = Db.Sequelize.Op;
                // Search for a user by username or email
                let result = await Db.User.findOne({
                    attributes: ['firstName', 'lastName', 'status', 'avatar']/*{exclude: ['admin', 'password', 'created']}*/,
                    where: {
                        [Op.and]: [
                        { [Op.or]: [{ "username": req.params.name }, { "email": req.params.name }] },
                        { [Op.not]: { id: req.auth.credentials.id }}
                        ]
                    },                   
                    order: Db.Sequelize.col('username')
                })
                return h.response(result).code(200);         
            } catch (err) {
                return Boom.badImplementation(`Could not load users. Error: ${err}`)
            }
        }
    }
]