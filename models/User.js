module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
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
        },
        admin: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    });

    User.associate = (models) => {
        models.User.hasMany(models.Message, {foreignKey: 'sender', targetKey: 'sender'});
        models.User.hasMany(models.Message, {foreignKey: 'receiver', targetKey: 'receiver'});
    };
    return User;
}