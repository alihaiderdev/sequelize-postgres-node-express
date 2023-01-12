const express = require('express');
const { createComment, getComments, deleteComment, getComment, updateComment } = require('../controllers/commentControllers');

const router = express.Router();

router.route('/').post(createComment).get(getComments);
router.route('/:uuid').delete(deleteComment).get(getComment).patch(updateComment);

module.exports = router;
