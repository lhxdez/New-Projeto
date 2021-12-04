const User = require("../model/User");
const Post = require("../model/Posts");

module.exports = {
  async searchPost(req, res) {
    const post = req.body;
    // const dbuser = await User.findOne({email : user.email});
    const { title } = req.body;
    const dbpost = await Post.findOne({ title });
    try {
      if (!dbpost) {
        return res.status(409).send({ error: "Post não cadastrado!" });
      }

      if (dbpost.title === post.title) {
        console.log("foi");
        return res.status(201).send({dbpost});
      } else {
        return res.status(409).send({ error: "Post Incorreta" });
      }
    } catch (error) {
      console.log(error);
    }
  },

  async registerPost(req, res) {
    try {
      const post = new Post(req.body);
      post.save();
      return res.status(201).send({ post });
    } catch (error) {
      console.log(error);
    }
  },
};
