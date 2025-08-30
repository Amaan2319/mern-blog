const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const mongoURI = process.env.MONGO_URI

const connectDB = async () =>{
  await mongoose.connect(mongoURI)
    .then(()=>{
      console.log("MongoDB connected successfully");
    })
    .catch((error)=>{
      console.log("Error connecting to MongoDB", error);
    })
}

module.exports=connectDB;