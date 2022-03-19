const { Sequelize, DataTypes } = require("sequelize");
const database = require("../connection/index");


const table = database.define(
    "user",
    {
        // attributes
        user_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userName: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        permission_class: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue : 'guest',
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
            }
        },
        ip_address : {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                isIPv4: true,
            }
        }
    },
    {
        //option
    }
);

(async () => {
    await table.sync({ force: false });
})();

module.exports = table;
