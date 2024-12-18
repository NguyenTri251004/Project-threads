"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ThreadImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define association here
      ThreadImage.belongsTo(models.Thread, { foreignKey: "thread_id", onDelete: "CASCADE" });
    }
  }

  ThreadImage.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      thread_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "threads",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      image_url: {
        type: DataTypes.STRING(2083),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "ThreadImage",
      tableName: "thread_images",
      schema: "public",
      timestamps: false, // Disable Sequelize's automatic timestamp fields
    }
  );

  return ThreadImage;
};