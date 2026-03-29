import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

router.post("/signup", async (req,res) =>{

    try {
        console.log("Registration test");
        const {userName, email, password} = req.body;
        // console.log(userName);
        const existingUser = await User.findOne({email});

        if (existingUser){
            res.status(400).json({error: "User already exist"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User(
            {
                userName: userName,
                email: email,
                password: hashedPassword
            }
        )
        await user.save();

        res.json({message : "User Registration Successful"});
        
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "User Registration Failed"});
    }
   
});

router.post("/login", async(req,res)=>{
    try {
        const {email, password} = req.body;
        console.log("Email " + email);
        const user = await User.findOne({email});
        console.log(user);
        if (!user){
            return res.status(400).json({error : "User not exist"});
        }
        // console.log("password " + password);
        // console.log("user password " + user.password);
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch){
            return res.status(400).json({error: "Invalid Credetials"});
        }
// create token
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email
      }
    });

    } catch (error) {
        console.error(error);
        return res.status(500).json({error: "Unable to Login"});
    }

});

export default router;