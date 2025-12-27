// const User = require('../models/User');
// const Post = require('../models/Post');

// // // Middleware to check if user is admin
// // const isAdmin = (req, res, next) => {
// //   if (req.user && req.user.role === 'admin') {
// //     return next();
// //   }
// //   return res.status(403).json({ message: 'Access denied: Admins only' });
// // };

// // // Middleware to check if user is admin or the same user
// // const canAccessUser = async (req,res,next)=>{
// //   const targetUserId = req.params.id || req.body.id;
// //   if(req.user._id && targetUserId && req.user._id.toString() === targetUserId.toString()){
// //     return next();
// //   }

// //   const targetUser = await User.findById(targetUserId);
// //   if(!targetUser){
// //     return res.status(404).json({message: "User not found"});
// //   }
// //   if(req.user.role === 'admin' && targetUser.role !== 'admin'){
// //     return next();
// //   }

// //   return res.status(403).json({message: "Access denied: Not authorized to access this user"});
// // }

// // // Middleware to check post ownership or admin (but admin cannot edit/delete other's posts unless needed)
// // const canModifyPost = async (req, res, next) => {
// //   const post = await Post.findById(req.params.id);

// //   if (!post) return res.status(404).json({ message: 'Post not found' });

// //   if (post.createdBy.toString() === req.user._id.toString() || req.user.role === 'admin') {
// //     return next();
// //   }

// //   return res.status(403).json({ message: 'Access denied: Not owner' });
// // };


// // module.exports = {
// //   isAdmin,
// //   canAccessUser,
// //   canModifyPost
// // }

// const jwt = require('jsonwebtoken');
// const SECRET_KEY = process.env.SECRET_KEY; // same as above

// // Middleware to verify JWT and set req.user
// const authenticate = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'Unauthorized. No token provided.' });
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = jwt.verify(token, SECRET_KEY);
//     req.user = decoded; // contains id and role
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Invalid or expired token.' });
//   }
// };





// // Admin-only access
// const isAdmin =  (req, res, next) => {
//   if (req.user.role !== 'admin') {
//     return res.status(403).json({ message: 'Access denied. Admins only.' });
//   }
//   next();
// };

// // User can only access their own profile
// const canAccessUser = (req, res, next) => {
//   const isSelf = req.user.id === req.params.id;
//   const isAdmin = req.user.role === 'admin';

//   if (!isSelf && !isAdmin) {
//     return res.status(403).json({ message: 'Access denied.' });
//   }

//   next();
// };

// // Middleware to check post ownership or admin (but admin cannot edit/delete other's posts unless needed)
// const canModifyPost = async (req, res, next) => {
//   if (!req.user) return res.status(401).json({ message: 'Unauthorized. No token provided.' });

//   try {
//     const post = await Post.findById(req.params.id);
//     if (!post) return res.status(404).json({ message: 'Post not found' });

//     if (post.createdBy.toString() === req.user.id || req.user.role === 'admin') {
//       return next();
//     }

//     return res.status(403).json({ message: 'Access denied: Not owner' });
//   } catch (err) {
//     return res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };



// module.exports = {
//   authenticate,
//   isAdmin,
//   canAccessUser,
//   canModifyPost
// };


const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Post = require('../models/Post');

const SECRET_KEY = process.env.SECRET_KEY;

// Middleware to verify JWT and set req.user
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    // Normalize to always use `id`
    req.user = {
      id: decoded.id || decoded._id,
      role: decoded.role
    };


    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};


// Admin-only access
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};

// User can only access their own profile (or admin)
const canAccessUser = (req, res, next) => {
  const isSelf = req.user.id === req.params.id;
  const isAdmin = req.user.role === 'admin';

  if (!isSelf && !isAdmin) {
    return res.status(403).json({ message: 'Access denied.' });
  }

  next();
};

// Middleware to check post ownership or admin
const canModifyPost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    if (!postId) {
      return res.status(400).json({ message: 'Post ID not provided.' });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.createdBy.toString() === req.user.id || req.user.role === 'admin') {
      return next();
    }

    return res.status(403).json({ message: 'Access denied: Not owner' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  authenticate,
  isAdmin,
  canAccessUser,
  canModifyPost
};
