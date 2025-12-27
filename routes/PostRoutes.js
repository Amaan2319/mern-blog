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

router.get("/posts", getAllPosts); // public feed
router.get("/posts/:id", getSinglePost);

router.get("/posts/me", authenticate, fetchUserPosts);
router.post("/posts", authenticate, CreatePost);
router.put("/posts/:id", authenticate, updatePost);
router.delete("/posts/:id", authenticate, deletePost);


  module.exports = router;