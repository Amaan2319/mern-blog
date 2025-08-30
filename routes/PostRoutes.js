// Import necessary modules and controllers
const {
  getAllPosts,
  getSinglePost,
  CreatePost,
  deletePost,
  updatePost,
  fetchUserPosts, 
} = require("../controllers/PostController.js");
const { canModifyPost, authenticate } = require("../middlewares/auth.js");

const router = require("express").Router();

// Public route to get all posts
router.get("/posts", getAllPosts);

// Protected route to get posts for the currently logged-in user
router.get("/posts/me", authenticate, fetchUserPosts);
// Protected route to get a single post by ID
router.get("/posts/:id", getSinglePost);


// Protected route to create a new post
router.post("/posts", authenticate, CreatePost);

// Protected route to update an existing post
router.put("/posts/:id", authenticate, canModifyPost, updatePost);

// Protected route to delete an existing post
router.delete("/posts/:id", authenticate, canModifyPost, deletePost);

module.exports = router;
