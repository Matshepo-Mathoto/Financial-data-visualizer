const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("financial", "root", "Password@1", {
  host: "localhost",
  dialect: "mysql",
});

const FinancialRecord = sequelize.define("FinancialRecord", {
  record_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  month: {
    type: DataTypes.FinancialRecord,
    allowNull: false,
  },
  year: {
    type: DataTypes.FinancialRecord,
    allowNull: false,
  },
});

module.exports = FinancialRecord;
