const { Sequelize, DataTypes } = require("sequelize");
const database = require("../connection/index");


const table = database.define(
    "ocr_result",
    {
        // attributes
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        ocr_result: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        submit_result: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        image: {
            type: Sequelize.DataTypes.BLOB("long"),
            allowNull: false,
        },
    },
    {
        //option
    }
);

(async () => {
    await table.sync({ force: false });
})();

module.exports = table;
