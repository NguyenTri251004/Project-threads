"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Follow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here
      Follow.belongsTo(models.User, { as: "Follower", foreignKey: "follower_id" });
      Follow.belongsTo(models.User, { as: "Followed", foreignKey: "followed_id" });
    }
  }

  Follow.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      follower_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        allowNull: true,
      },
      followed_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Follow",
      tableName: "follows",
      schema: "public",
      timestamps: false, // Disable Sequelize's automatic timestamp fields
    }
  );

  return Follow;
};