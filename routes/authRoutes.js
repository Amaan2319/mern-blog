const { isAdmin, canAccessUser, authenticate } = require('../middlewares/auth');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const SECRET_KEY = process.env.SECRET_KEY;


const bcrypt = require('bcryptjs');

const router = require('express').Router();


// register new user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long" });
  }

  const existingUser = await User.findOne({ email });
  const extuser = await User.findOne({ username });

  if (existingUser) {
    return res.status(400).json({ message: "User already exists with this email" });
  }
  if (extuser) {
    return res.status(400).json({ message: "User already exists with this username" });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: passwordHash });
    await user.save();

    // generate token like login
    const token = jwt.sign(
      { id: user._id, role: user.role },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  }
  catch (error) {
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
});


router.get('/users',authenticate, isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    if (users.length > 0) {
      return res.status(200).json({ users });
    } else {
      return res.status(404).json({ message: "No users found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching users", error: error.message });
  }
});


router.delete('/users/delete/:id', canAccessUser, authenticate, isAdmin, async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const findUser = await User.findById(id);
    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent deleting yourself or other admins
    if (findUser.role === 'admin') {
      return res.status(403).json({ message: "Cannot delete an admin user" });
    }

    const deletedUser = await User.findByIdAndDelete(id);
    if (deletedUser) {
      return res.status(200).json({ message: "User deleted successfully!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
});


//update user
router.put('/users/update/:id', authenticate, canAccessUser, async (req,res)=>{
  const {id} = req.params
  const { username, email, password } = req.body;
  if(!id || !username || !email){
    return res.status(400).json({message: "All field are required"});
  }
  
  const user = await User.findById(id);
  if(!user){
    return res.status(404).json({message: "User not found"});
  }
  try{
    let updateData = {username, email}
    if(password){
      updateData.password = await bcrypt.hash(password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
    if(updatedUser){
      return res.status(200).json({message: "User updated successfully!"});
  }
}
  catch(error){
    res.status(500).json({message: "Error updating user", error: error.message});
  }
})

router.post('/login', async(req,res)=>{

    
  const { email, password } = req.body;
  if(!email || !password){
    return res.status(400).json({message: "Email and password are required"});
  }

  try{
    const user = await User.findOne({email})
    
    if(!user){
      return res.status(404).json({message: "User not found"});
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
      return res.status(400).json({message: "Invalid credentials"});
    }
    //token for user
    const token = jwt.sign(
      { id: user._id, role: user.role },
      SECRET_KEY,
      { expiresIn: '1h' }
    );
    return res.status(200).json({
  message: "Login successful",
  token,
  user: { id: user._id, username: user.username, email: user.email, role: user.role }
}); 
console.log(token) }
  catch(error){
    res.status(500).json({message: "Error logging in", error: error.message});
  }
    
})

module.exports = router;