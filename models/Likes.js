"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here
      Like.belongsTo(models.Thread, { foreignKey: "thread_id", onDelete: "CASCADE", as: 'likes-threads' });
      Like.belongsTo(models.User, { foreignKey: "user_id", onDelete: "CASCADE" });
    }
  }

  Like.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      thread_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "threads",
          key: "id",
        },
        allowNull: false,
        onDelete: "CASCADE",
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        allowNull: false,
        onDelete: "CASCADE",
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Like",
      tableName: "likes",
      schema: "public",
      timestamps: false, 
    }
  );

  return Like;
};