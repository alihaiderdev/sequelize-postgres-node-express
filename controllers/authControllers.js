const { User, Post, Comment } = require('../models');

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

exports.getUsers = async (req, res) => {
  const users = await User.findAll({
    include: [
      { model: Post, as: 'posts', attributes: ['title', 'content', 'uuid'] },
      { model: Comment, as: 'comments', attributes: ['comment', 'uuid'] },
    ],
  });
  try {
    res.status(200).json({
      status: 'success',
      data: users,
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
