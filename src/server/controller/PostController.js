const User = require("../model/User");
const Post = require("../model/Posts");

module.exports = {
  async searchPost(req, res) {
    const post = req.body;
    const { title } = req.body;
    const dbpost = await Post.find({ title });
    try {
      
      if(await Post.find({ title })){
        console.log('foi');
        return res.status(201).send({dbpost});
      }else{
        return res.status(409).send({ error: "Sem resultados" });
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
