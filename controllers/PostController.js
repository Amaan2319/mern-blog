// const Post = require("../models/Post")

// const getAllPosts = async (req,res)=>{
//   try {
//     const posts = await Post.find().populate("createdBy", "username");
//     res.status(200).json(posts);
//   } catch (error) {
//     res.status(500).json({message: "Error fetching posts", error: error.message});
//   }
// }

// const fetchUserPosts = async (req, res) => {
//   try {
//     const posts = await Post.find({ createdBy: req.user.id })
//       .populate("createdBy", "username");

//     return res.status(200).json(posts);
//   } catch (error) {
//     console.error("Error in fetchUserPosts:", error); // <--- ADD THIS
//     return res.status(500).json({
//       message: "Error fetching user's posts",
//       error: error.message,
//     });
//   }
// };


// const getSinglePost = async (req, res)=>{
//   try{
//     const post = await Post.findById(req.params.id)
//     if (!post) {
//       return res.status(404).json({message: "Post not found"});
//     }
//     res.status(200).json(post)
//   } catch(error){
//     res.status(500).json({message: "Error fetching post", error: error.message});
//   }
// }

// const CreatePost = async (req, res) => {
//   const { title, content } = req.body;

//   if (!title || !content) {
//     return res.status(400).json({ message: "Title and content are required" });
//   }

//   try {
//     const createdPost = new Post({ title, content, createdBy: req.user.id });
//     await createdPost.save();
//     res.status(201).json("Post created successfully!", createdPost);
//   } catch (error) {
//     res.status(500).json({ message: "Error creating post", error: error.message });
//   }
// };


// const deletePost = async (req,res)=>{
//   try{
//     const deletedPost = await Post.findByIdAndDelete(req.params.id);
//     if(!deletedPost){
//       return res.status(404).json({message: "Post not found"});
//     }
//     res.status(200).json({message: "Post deleted successfully!"});
//   }catch(error){
//     res.status(500).json({message: "Error deleting post", error: error.message});
//   }
// }

// const updatePost = async (req,res)=>{
//   try{
//     const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {new: true})
//     if(!updatedPost){
//       res.status(404).json({message: "Post not found"});
//     }
//     res.status(200).json({message: "Post updated successfully!"});
//   }catch(error){
//     res.status(500).json({message: "Error updating post", error: error.message});
//   }
// }

// module.exports = {
//   getAllPosts,
//   getSinglePost,
//   CreatePost,
//   deletePost,
//   updatePost,
//   fetchUserPosts,
// }

//gemini correction for edit/delete buttons in posts.jsx page 
const Post = require("../models/Post");

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("createdBy", "username");
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error: error.message });
  }
};

const fetchUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ createdBy: req.user.id }).populate("createdBy", "username");
    return res.status(200).json(posts);
  } catch (error) {
    console.error("Error in fetchUserPosts:", error);
    return res.status(500).json({
      message: "Error fetching user's posts",
      error: error.message,
    });
  }
};

const getSinglePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post).populate("createdBy", "username");
  } catch (error) {
    res.status(500).json({ message: "Error fetching post", error: error.message });
  }
};

const CreatePost = async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  try {
    const createdPost = new Post({ title, content, createdBy: req.user.id });
    await createdPost.save();

    // After saving, find the newly created post and populate the 'createdBy' field.
    const populatedPost = await Post.findById(createdPost._id).populate("createdBy", "username");

    // Send the populated post back to the client.
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: "Error creating post", error: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Post deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("createdBy", "username");
    if (!updatedPost) {
      res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Post updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error updating post", error: error.message });
  }
};

module.exports = {
  getAllPosts,
  getSinglePost,
  CreatePost,
  deletePost,
  updatePost,
  fetchUserPosts,
};
