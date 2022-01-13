const { off } = require("process");
const { User, Thought } = require("../models");

module.exports = {
  // getUsers
  getUsers(req, res) {
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },

  // getSingleUser and populate thought and friend data
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .populate([{ path: "thoughts" }, { path: "friends" }])
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user with that ID" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  // createUser
  createUser(req, res) {
    User.create(req.body)
      .then((newUser) => res.status(200).json(newUser))
      .catch((err) => res.status(500).json(err));
  },

  // updateUser by id
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user with that ID" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  // deleteUser and associated thoughts
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user with that ID" })
          : Thought.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() =>
        res.json({ message: "User and associated thoughts deleted!" })
      )
      .catch((err) => res.status(500).json(err));
  },

  // addNewFriend
  addNewFriend(req, res) {
    User.findOneandUpdate(
      { _id: req.params.userId },
      { $push: { friends: req.params.friendId } },
      { new: true }
    )
      .then((data) =>
        !data
          ? res.status(404).json({ message: "No user with that ID" })
          : res.json(data)
      )
      .catch((err) => res.status(500).json(err));
  },

  // deleteFriend

  deleteFriend(req, res) {
    User.findOneandUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .then((data) =>
        !data
          ? res.status(404).json({ message: "No user with that ID" })
          : res.json(data)
      )
      .catch((err) => res.status(500).json(err));
  },
};
