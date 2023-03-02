const express = require('express');

const { getUser, getUsers, updateUser, createUser, deleteUser, findUsers } = require('../controllers/authControllers');

const router = express.Router();

// router.post("/", createUser);
// router.get("/", getUsers);
// router.delete("/:id", deleteUser);
// router.get("/:id", getUser);
// router.patch("/:id", updateUser);

// OR

router.get('/search', findUsers);
router.route('/').post(createUser).get(getUsers);
router.route('/:uuid').delete(deleteUser).get(getUser).patch(updateUser);

module.exports = router;
