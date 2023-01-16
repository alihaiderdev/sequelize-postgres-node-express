const { User, Post, Comment } = require('../models');
const { Op } = require('sequelize');

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    console.log('error.message : ', error.message);
    res.status(404).json({ status: 'error', error: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { uuid: req.params.uuid },
      include: [
        { model: Post, as: 'posts', attributes: ['title', 'content', 'uuid'] },
        { model: Comment, as: 'comments', attributes: ['comment', 'uuid'] },
      ],
    });
    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    console.log('error.message : ', error.message);
    res.status(404).json({ status: 'error', error: error.message });
  }
};

// exports.getUsers = async (req, res) => {
//   const users = await User.findAll({
//     include: [
//       { model: Post, as: 'posts', attributes: ['title', 'content', 'uuid'] },
//       { model: Comment, as: 'comments', attributes: ['comment', 'uuid'] },
//     ],
//   });
//   try {
//     res.status(200).json({
//       status: 'success',
//       data: users,
//     });
//   } catch (error) {
//     console.log('error.message : ', error.message);
//     res.status(404).json({ status: 'error', error: error.message });
//   }
// };

exports.getUsers = async (req, res) => {
  let { page, per_page, fields, sort, sort_direction = 'asc', ...resQueries } = req.query;
  page = parseInt(page) || 1;
  per_page = parseInt(per_page) || 5;

  const query = {
    raw: true,
    limit: per_page,
    offset: (page - 1) * per_page,
    distinct: true,
    attributes: {
      exclude: ['id', 'password'],
    },
  };
  if (fields) {
    query.attributes = [...fields.split(',')];
  }
  if (sort) {
    query.order = [...sort.split(',').map((s) => [s, sort_direction]), ...query.order];
  }

  if (Object.keys(resQueries).length > 0) {
    for (let key in resQueries) {
      if (typeof resQueries[key] === 'string') {
        resQueries[key] = resQueries[key];
      } else if (Array.isArray(resQueries[key])) {
        resQueries[key] = { [Op.or]: resQueries[key] };
      } else if (typeof resQueries[key] === 'object' && resQueries[key] !== null) {
        let start, end;
        Object.entries(resQueries[key]).forEach(([k, v]) => {
          k.includes('g') ? (start = new Date(v)) : (end = new Date(v));
          resQueries[key] = { [Op.between]: [start, end] };
        });
      }
    }
    query.where = resQueries;
  }

  console.log(resQueries);

  const { count, rows } = await User.findAndCountAll(query);

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

exports.updateUser = async (req, res) => {
  try {
    const { uuid } = req.params;
    let user = await User.update(req.body, {
      where: { uuid },
    });
    user = await User.findOne({ where: { uuid } });
    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    console.log('error.message : ', error.message);
    res.status(404).json({ status: 'error', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findOne({ where: { uuid: req.params.uuid } });
    await user.destroy();
    // OR
    // but not return delete document in reponse instead return 1 on successfully deleted
    // const user = await User.destroy({ where: { uuid: req.params.uuid } });
    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    console.log('error.message : ', error.message);
    res.status(404).json({ status: 'error', error: error.message });
  }
};
