'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    // }
    static associate({ Post, Comment }) {
      // define association here
      this.hasMany(Post, { foreignKey: 'userId', as: 'posts' });
      this.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
    }
    toJSON() {
      return { ...this.get(), id: undefined }; // by setting id: undefined we restrict the auto generated id to not send response object
    }
  }
  // https://sequelize.org/docs/v6/core-concepts/validations-and-constraints/
  User.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      firstName: { type: DataTypes.STRING },
      lastName: { type: DataTypes.STRING },
      // virtual property
      fullName: {
        type: DataTypes.VIRTUAL,
        get() {
          return `${this.firstName} ${this.lastName}`;
        },
        set(value) {
          throw new Error('Do not try to set the `fullName` value its a virtual property!');
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: 'Email is already taken please try with other email!',
        },
        validate: {
          notNull: { msg: 'Email is required!' },
          isEmail: { msg: 'Please provide a valid email!' },
          notEmpty: { msg: 'Email must not be empty string!' },
        },
        // set(value) {
        //   // Storing passwords in plaintext in the database is terrible.
        //   // Hashing the value with an appropriate cryptographic hash function is better.
        //   this.setDataValue("email", value.toLowerCase());
        // },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Password must not be empty string!' },
          // min 8 letter password, with at least a symbol, upper and lower case letters and a number
          // is: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/g,
          is: {
            args: [/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/g],
            msg: `Password should contains minimum 8 characters, with at least 1 symbol 1 uppercase letter 1 lowercase letter and 1 number!`,
          },
          // another regex
          // /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/

          // len: [8, 50], // only allow values with length between 2 and 10
          // OR
          // max: 50, // only allow values <= 50
          // min: 8, // only allow values >= 8
        },
      },
      gender: {
        // type: Sequelize.ENUM("male", "female", "other"]),
        // OR
        type: DataTypes.ENUM,
        values: ['male', 'female', 'other'],
        validate: {
          isIn: {
            args: [['male', 'female', 'other']],
            msg: `Gender should be from these values male, female, other!`,
          },
          // OR
          // checkGender(value) {
          //   if (!["male", "female", "other"].includes(value)) {
          //     throw new Error(
          //       `Gender should be from these values male, female, other!`
          //     );
          //   }
          // },
        },
      },
      role: {
        type: DataTypes.ENUM,
        values: ['user', 'admin', 'super-admin'],
        allowNull: false,
        validate: {
          notNull: { msg: 'Role is required!' },
          notEmpty: { msg: 'User role must not be empty string!' },
          isIn: {
            args: [['user', 'admin', 'super-admin']],
            msg: `Role should be from these values user, admin, super-admin!`,
          },
        },
      },
      isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      // use this way to convert email to all small characters or the above set method way
      hooks: {
        beforeValidate: function (user, options) {
          // console.log({ options, user });
          if (typeof user.email === 'string') {
            user.email = user.email.toLowerCase();
          }
        },
      },
      sequelize,
      modelName: 'User',
      tableName: 'users',
      // createdAt: 'created_at',
      // updatedAt: 'updated_at',
    }
  );
  return User;
};
