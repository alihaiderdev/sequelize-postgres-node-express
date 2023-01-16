const { sequelize, Post, User, Comment } = require('../models');
const { Sequelize } = require('sequelize');

exports.createPost = async (req, res) => {
  try {
    const { userId, ...body } = req.body;
    const user = await User.findOne({ where: { uuid: userId } });
    const post = await Post.create({ userId: user.id, ...body });
    res.status(201).json({
      status: 'success',
      data: post,
    });
  } catch (error) {
    console.log('error.message : ', error.message);
    res.status(404).json({ status: 'error', error: error.message });
  }
};

exports.getPost = async (req, res) => {
  try {
    // const posts = await Post.findAll({ include: "user" }); // only if we want to include single model
    const post = await Post.findOne({
      where: { uuid: req.params.uuid },
      // include: ['comments', 'user'],
      include: [
        { model: User, as: 'user', attributes: ['email', 'role', 'uuid'] },
        { model: Comment, as: 'comments', attributes: ['comment', 'uuid'] },
      ],
    });
    res.status(200).json({
      status: 'success',
      data: post,
    });
  } catch (error) {
    console.log('error.message : ', error.message);
    res.status(404).json({ status: 'error', error: error.message });
  }
};

exports.getPosts = async (req, res) => {
  let { page, per_page, fields, sort, sort_direction = 'asc' } = req.query;
  page = parseInt(page) || 1;
  per_page = parseInt(per_page) || 5;
  console.log(req.query);
  const query = {
    include: [
      { model: User, as: 'user', attributes: ['email', 'role', 'uuid'] },
      {
        model: Comment,
        as: 'comments',
        attributes: ['comment', 'uuid'],
        attributes: {
          // include: ['comment', 'uuid'],
          exclude: ['uuid'],
        },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['email', 'role'],
            // OR
            // here we must have to use include or exclude one at a time if we use both at a time it will not work and return all fields
            // attributes: {
            //   // include: [[sequelize.fn('COUNT', sequelize.col('hats')), 'n_hats']],
            //   // exclude: ['role'],
            // },
          },
        ],
      },
    ],
    attributes: {
      exclude: ['id', 'userId'],
    },
    // https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#ordering-and-grouping
    order: [[{ model: Comment, as: 'comments' }, 'comment', 'desc']], // include model fileds ordering/sorting
    // order: [['title', 'ASC']], // here asc and desc is case insensitive
    limit: per_page,
    offset: (page - 1) * per_page,
    distinct: true, // here we add distinct: true to the query. Without this Sequelize returns the count for the values without an inner join/required: true.
  };
  if (fields) {
    query.attributes = [...fields.split(',')];
  }
  if (sort) {
    console.log(query.order, ...query.order);
    query.order = [...sort.split(',').map((s) => [s, sort_direction]), ...query.order];
  }

  const { count, rows } = await Post.findAndCountAll(query);

  try {
    res.status(200).json({
      status: 'success',
      data: rows,
      pagination: {
        total_pages: Math.ceil(count / per_page),
        total_items: count,
        current_page: page,
        items_per_page: rows.length,
      },
    });
  } catch (error) {
    console.log('error.message : ', error.message);
    res.status(404).json({ status: 'error', error: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { uuid } = req.params;
    let post = await Post.update(req.body, {
      where: { uuid },
    });
    post = await Post.findOne({ where: { uuid } });
    res.status(200).json({
      status: 'success',
      data: post,
    });
  } catch (error) {
    console.log('error.message : ', error.message);
    res.status(404).json({ status: 'error', error: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findOne({ where: { uuid: req.params.uuid } });
    await post.destroy();
    res.status(200).json({
      status: 'success',
      data: post,
    });
  } catch (error) {
    console.log('error.message : ', error.message);
    res.status(404).json({ status: 'error', error: error.message });
  }
};
