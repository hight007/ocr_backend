const Sequelize = require("sequelize");

const sequelize = new Sequelize("hightokung", "postgres", "", {
    host: "localhost",
    dialect: "postgres",
});

(async () => {
    await sequelize.authenticate();
})();

module.exports = sequelize;
