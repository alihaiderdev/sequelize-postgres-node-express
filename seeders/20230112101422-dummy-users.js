'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      'users',
      [
        {
          firstName: 'ali',
          lastName: 'haider',
          email: 'ali@email.com',
          password: 'Ali123@#',
          uuid: '35cf1b89-56d3-433c-9f43-4198eb3725de',
          role: 'admin',
          isActive: false,
          isDeleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: 'hasnain',
          lastName: 'anwar',
          password: 'hasnain',
          email: 'hasnain@email.com',
          uuid: '35cf1b89-56d3-433c-9f43-4198eb3725df',
          role: 'user',
          isActive: false,
          isDeleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
