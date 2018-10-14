// Models
let db = require('../../../models')

require('dotenv').config();
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = process.env.PASSWORD

module.exports = {
    // Module for encrypting DB content
    encrypt: function (content) {
        try {
            var cipher = crypto.createCipher(algorithm, password);
            var crypted = cipher.update(content, 'utf8', 'hex')
            crypted += cipher.final('hex');
            return crypted;
        }
        catch (err) {
            return (`Failed to encrypt content. ${err}`);
        }
    },
    // Module for decrypting DB content
    decrypt: function (content) {
        try {
            var decipher = crypto.createDecipher(algorithm, password);
            var decrypted = decipher.update(content, 'hex', 'utf8')
            decrypted += decipher.final('utf8');
            return decrypted;
        }
        catch (err) {
            return (`Failed to decrypt content. ${err}`);
        }
    },
    // Module for checking if content is present in Db
    inDb: async (id) => {
        try {
            var inDb = await db.Message.findOne({
                where: {
                    id: id,
                }
            })
            if (inDb.dataValues != null) {
                return true;
            }
        }
        catch (err) {
            return false;
        }
    },
    // Check if user has ownership of message
    isOwner: async (id, sender) => {
        try {
            var isOwner = await db.Message.findOne({
                where: {
                    id: id,
                    sender: sender,
                }
            })
            if (isOwner.dataValues != null) {
                return true;
            }
        }
        catch (err) {
            return false;
        }
    }
}