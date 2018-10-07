module.exports = (sequelize, Sequelize) => {
    const Message = sequelize.define('Message', {
        sender: {
            type: Sequelize.INTEGER,
            allowNull: false
            // references: {
            //     model: User,
            //     key: 'id'
            // }
        },
        receiver: {
            type: Sequelize.INTEGER,
            allowNull: false
            // references: {
            //     model: User,
            //     key: 'id'
            // }
        },
        content: {
            type: Sequelize.STRING
        },
        time: {
            type: Sequelize.DATE
        }
    });

    Message.associate = (models) => {
        models.Message.belongsTo(models.User, {foreignKey: 'sender', sourceKey: 'sender'});
        models.Message.belongsTo(models.User, {foreignKey: 'receiver', sourceKey: 'receiver'});
    }
    return Message;
};