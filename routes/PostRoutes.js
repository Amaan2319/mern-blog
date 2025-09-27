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

// Public routes
router.get("/posts", getAllPosts);
router.get("/posts/:id", getSinglePost);

// Protected routes
router.get("/posts/me", authenticate, fetchUserPosts);
router.post("/posts", authenticate, CreatePost);
router.put("/posts/:id", canModifyPost, updatePost);
router.delete("/posts/:id", authenticate, canModifyPost, deletePost);

module.exports = router;