module.exports = (sequelize, Sequelize) => {
    const Message = sequelize.define('Message', {
        sender: {
            type: Sequelize.STRING(40),
            allowNull: false,
        },
        receiver: {
            type: Sequelize.STRING(40),
            allowNull: false
        },
        content: {
            type: Sequelize.STRING(9999),
            allowNull: false
        },
        unread: {
            type: Sequelize.BOOLEAN,
            alowNull: false,
            defaultValue: true
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
        }
    );

    Message.associate = (models) => {
        models.Message.belongsTo(models.User, { foreignKey: 'sender', targetKey: 'username' });
        models.Message.belongsTo(models.User, { foreignKey: 'receiver', targetKey: 'username' });
    }
    return Message;
};
