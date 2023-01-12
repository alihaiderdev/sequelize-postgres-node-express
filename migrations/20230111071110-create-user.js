'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      firstName: { type: DataTypes.STRING },
      lastName: { type: DataTypes.STRING },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: 'Email is required!' },
          isEmail: { msg: 'Please provide a valid email!' },
          notEmpty: { msg: 'Email must not be empty string!' },
        },
        set(value) {
          this.setDataValue('email', value.toLowerCase());
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Password must not be empty string!' },
          is: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/g,
        },
      },
      // gender: DataTypes.ENUM("male", "female", "other"),
      gender: {
        type: DataTypes.ENUM,
        values: ['male', 'female', 'other'],
        validate: {
          isIn: {
            args: [['male', 'female', 'other']],
            msg: `Gender should be from these values male, female, other!`,
          },
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
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('users');
  },
};
