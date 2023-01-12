const express = require("express");

const {
  createPost,
  getPosts,
  deletePost,
  getPost,
  updatePost,
} = require("../controllers/postControllers");

const router = express.Router();

router.route("/").post(createPost).get(getPosts);
router.route("/:uuid").delete(deletePost).get(getPost).patch(updatePost);

module.exports = router;
