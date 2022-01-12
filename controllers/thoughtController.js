const { User, Thought } = require("../models");

module.exports = {
  // getThoughts
  getThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.status(200).json(thoughts))
      .catch((err) => res.status(500).json(err));
  },

  // getSingleThought
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "Thought does not exist" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  // createThought
  createThought(req, res) {
    Thought.create(req.body)
      .then((thought) => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $addToSet: { thoughts: thought._id } },
          { new: true }
        );
      })
      .then((userData) =>
        !userData
          ? res.status(404).json({
              message: "Thought created, but found no user with that ID",
            })
          : res.json(userData)
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // updateThought

  // deleteThought

  // createReaction

  // deleteReaction
};
