"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here
      Notification.belongsTo(models.User, { foreignKey: "user_id", onDelete: "CASCADE" });
    }
  }

  Notification.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
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
      type: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
          isIn: [['new_follower', 'like', 'comment']],
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      is_read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Notification",
      tableName: "notifications",
      schema: "public",
      timestamps: false, // Disable Sequelize's automatic timestamp fields
    }
  );

  return Notification;
};
