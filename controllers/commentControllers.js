const { Comment, User, Post } = require('../models');

exports.createComment = async (req, res) => {
  try {
    const { userId, postId, ...body } = req.body;
    const user = await User.findOne({ where: { uuid: userId } });
    const post = await Post.findOne({ where: { uuid: postId } });
    const comment = await Comment.create({ userId: user.id, postId: post.id, ...body });
    res.status(201).json({
      status: 'success',
      data: comment,
    });
  } catch (error) {
    console.log('error.message : ', error.message);
    res.status(404).json({ status: 'error', error });
  }
};

exports.getComment = async (req, res) => {
  try {
    const comment = await Comment.findOne({
      where: { uuid: req.params.uuid },
      include: [
        { model: User, as: 'user', attributes: ['email', 'role', 'uuid'] },
        { model: Post, as: 'post', attributes: ['title', 'content', 'uuid'] },
      ],
    });
    res.status(200).json({
      status: 'success',
      data: comment,
    });
  } catch (error) {
    console.log('error.message : ', error.message);
    res.status(404).json({ status: 'error', error: error.message });
  }
};

exports.getComments = async (req, res) => {
  const comments = await Comment.findAll({
    include: [
      { model: User, as: 'user', attributes: ['email', 'role', 'uuid'] },
      { model: Post, as: 'post', attributes: ['title', 'content', 'uuid'] },
    ],
  });
  try {
    res.status(200).json({
      status: 'success',
      data: comments,
    });
  } catch (error) {
    console.log('error.message : ', error.message);
    res.status(404).json({ status: 'error', error: error.message });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { uuid } = req.params;
    let comment = await Comment.update(req.body, {
      where: { uuid },
    });
    comment = await Comment.findOne({ where: { uuid } });
    res.status(200).json({
      status: 'success',
      data: comment,
    });
  } catch (error) {
    console.log('error.message : ', error.message);
    res.status(404).json({ status: 'error', error: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findOne({ where: { uuid: req.params.uuid } });
    await comment.destroy();
    res.status(200).json({
      status: 'success',
      data: comment,
    });
  } catch (error) {
    console.log('error.message : ', error.message);
    res.status(404).json({ status: 'error', error: error.message });
  }
};
