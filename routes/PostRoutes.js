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

// 🔐 PROTECTED ROUTES FIRST
router.get("/posts/me", authenticate, fetchUserPosts);
router.post("/posts", authenticate, CreatePost);
router.put("/posts/:id", authenticate, updatePost);
router.delete("/posts/:id", authenticate, deletePost);

// 🔓 PUBLIC ROUTES LAST
router.get("/posts", getAllPosts);
router.get("/posts/:id", getSinglePost);



  module.exports = router;