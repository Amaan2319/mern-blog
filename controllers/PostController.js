const Post = require("../models/Post");

// ✅ GET ALL POSTS
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("createdBy", "username");

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET USER POSTS
const fetchUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ createdBy: req.user.id })
      .populate("createdBy", "username");

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET SINGLE POST (FIXED populate)
const getSinglePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("createdBy", "username");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ CREATE POST
const CreatePost = async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content required" });
  }

  try {
    const post = await Post.create({
      title,
      content,
      createdBy: req.user.id,
    });

    const populatedPost = await Post.findById(post._id)
      .populate("createdBy", "username");

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ UPDATE POST (THIS FIXES YOUR ISSUE)
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // 🔥 FIXED ownership check
    if (post.createdBy.toString() !== String(req.user.id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    post.title = req.body.title;
    post.content = req.body.content;

    const updatedPost = await post.save();

    const populatedPost = await Post.findById(updatedPost._id)
      .populate("createdBy", "username");

    res.status(200).json(populatedPost);
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ DELETE POST
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.createdBy.toString() !== String(req.user.id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllPosts,
  fetchUserPosts,
  getSinglePost,
  CreatePost,
  updatePost,
  deletePost,
};
