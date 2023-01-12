'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate({ User, Comment }) {
      // define association here
      // by default when we make association/relation with any table then sequelize will make foreignKey in the current table by the combination of table name where we relate the table and Id field e.g: table name = User and id field Id so the foreignKey will be "UserId" so to ovverride this behaviour { foreignKey: "userId", as: "user" }
      // this.belongsTo(User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE' }); // and here we setting as: "user" for include modle and in reponse show user in small not as model name User
      this.belongsTo(User, { foreignKey: 'userId', as: 'user' }); // and here we setting as: "user" for include modle and in reponse show user in small not as model name User
      this.hasMany(Comment, { foreignKey: 'postId', as: 'comments' });
    }
    toJSON() {
      return { ...this.get(), id: undefined, userId: undefined };
    }
  }
  Post.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'Title is required!' },
          notEmpty: { msg: 'Title must not be empty string!' },
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: { msg: 'Content is required!' },
          notEmpty: { msg: 'Content must not be empty string!' },
        },
      },
      isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: 'Post',
      tableName: 'posts',
    }
  );
  return Post;
};
