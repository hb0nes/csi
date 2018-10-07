module.exports = (sequelize, Sequelize) => {
    const Message = sequelize.define('Message', {
        sender: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        receiver: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        content: {
            type: Sequelize.STRING,
            allowNull: false
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