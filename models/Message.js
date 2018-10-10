module.exports = (sequelize, Sequelize) => {
    const Message = sequelize.define('Message', {
        sender: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                isInt: true
            }
        },
        receiver: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                isInt: true
            }
        },
        content: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
            indexes: [
                {
                    fields: ['sender'],
                    name: 'Sender'
                },
                {
                    fields: ['receiver'],
                    name: 'Receiver'
                }
            ],
        });

    Message.associate = (models) => {
        models.Message.belongsTo(models.User, { foreignKey: 'sender', sourceKey: 'sender' });
        models.Message.belongsTo(models.User, { foreignKey: 'receiver', sourceKey: 'receiver' });
    }
    return Message;
};
