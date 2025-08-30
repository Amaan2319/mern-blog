const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/db.js')
const cors = require('cors');
const postRoutes = require('./routes/PostRoutes.js');
const authRoutes = require('./routes/authRoutes.js');
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

app.use('/api', postRoutes);
connectDB()
app.get('/', (req,res)=>{
  res.status(200).json({message: "Welcome to the backend server!"});

  // res.send("Hello from the backend server")
}
)

app.use('/api/auth', authRoutes);

app.listen(port, ()=>{
  console.log(`Server is running on ${port}`);

})

module.exports = app;