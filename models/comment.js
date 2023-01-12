'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Post }) {
      // define association here
      this.belongsTo(User, { foreignKey: 'userId', as: 'user' });
      this.belongsTo(Post, { foreignKey: 'postId', as: 'post' });
    }
    toJSON() {
      return { ...this.get(), id: undefined, userId: undefined, postId: undefined };
    }
  }
  Comment.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: { msg: 'Comment is required!' },
          notEmpty: { msg: 'Comment must not be empty string!' },
        },
      },
      isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
      // postId: { type: DataTypes.INTEGER, allowNull: false },
      // userId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: 'Comment',
      tableName: 'comments',
    }
  );
  return Comment;
};
