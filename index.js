const express = require("express");
const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const bodyParser = require("body-parser")
require('dotenv').config()
const app = express();
const port = 5000;


async function conn(){
    try {
        await mongoose.connect(process.env.MONGO)
        console.log("database is connected");
    } catch (error) {
        console.log(`Error while connected to database`, error);
    }
   
}
conn();

const userSchema = new Schema({
    name: String, 
    email: String,
    password: String,
    age : Number
  });

const User = mongoose.model("User",userSchema );

app.use(bodyParser.json());


app.post("/signup", async (req,res)=>{
    const user = new User(req.body);
    try {
        const doc = await user.save();
        res.status(200).send();
    } catch (error) {
        res.status(400)
    }
})

app.post("/login", async (req,res)=>{
    const {email, password} = req.body;
    const user = await User.findOne({email, password})
    try {
        if (!user) {
            res.json({message: "user not found"})
        }else{
            return res.status(200).json({ name: user.name, email: user.email });
        }
    } catch (error) {
        res.status(404).json({message : "something went wrong"})
    }
})


app.listen(port, console.log(`The server is running on port ${port}`));