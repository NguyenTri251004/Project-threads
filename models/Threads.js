"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Thread extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here
      Thread.belongsTo(models.User, { foreignKey: "user_id", onDelete: "CASCADE", as: 'users-threads'});
      // Nếu cần thiết, thêm các mối quan hệ khác với các bảng khác như 'comments' hoặc 'likes' ở đây
    }
  }

  Thread.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      image_url: {
        type: DataTypes.STRING(2083),
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
      modelName: "Thread",
      tableName: "threads",
      schema: "public",
      timestamps: false, // Disable Sequelize's automatic timestamp fields
    }
  );

  return Thread;
};
