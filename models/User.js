module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
        username: {
            type: Sequelize.STRING(40),
            allowNull: false,
            unique: true,
            validate: {
                is: ["^[a-z0-9_-]+$", 'i']
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        firstName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                isAlpha: true
            }
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                isAlpha: true
            }
        },
        email: {
            type: Sequelize.STRING(50),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        admin: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    });

    User.associate = (models) => {
        models.User.hasMany(models.Message, { foreignKey: 'fk_sender', targetKey: 'sender', sourceKey: 'username' });
        models.User.hasMany(models.Message, { foreignKey: 'fk_receiver', targetKey: 'receiver', sourceKey: 'username' });
    };
    return User;
}