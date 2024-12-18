"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Token extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Token.belongsTo(models.User, { foreignKey: "email", targetKey: "email", as: "user-token" });
    }
  }

  Token.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        references: {
          model: "users",  // Reference to the `users` table
          key: "email",  // Email as the reference key
        },
        onDelete: "CASCADE",  // When a user is deleted, their tokens are also deleted
      },
      token: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      token_expiry: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Token",
      tableName: "tokens",
      schema: "public",
      timestamps: false,  // Disable automatic timestamp handling (created_at, updated_at)
    }
  );

  return Token;
};
