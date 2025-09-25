const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("financial", "root", "Password@1", {
  host: "localhost",
  dialect: "mysql",
});

const User = sequelize.define("User", {
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
  },

});

module.exports = User;
