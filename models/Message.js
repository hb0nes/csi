module.exports = (sequelize, Sequelize) => {
    const Message = sequelize.define('Message', {
        sender: {
            type: Sequelize.STRING,
            allowNull: false
        },
        receiver: {
            type: Sequelize.STRING,
            allowNull: false
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
        models.Message.belongsTo(models.User, { foreignKey: 'sender', sourceKey: 'sender', targetKey: 'username' });
        models.Message.belongsTo(models.User, { foreignKey: 'receiver', sourceKey: 'receiver', targetKey: 'username' });
    }
    return Message;
};
