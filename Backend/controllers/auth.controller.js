import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import generateTokenAndSetCookie from '../utils/generateToken.js';

export const login = async (req,res) =>{
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email});
        const isPasswordCorrect = bcrypt.compare(password,user.password);
        if(!user || !isPasswordCorrect){
            return res.status(400).json({error: "Invalid username or password"});
        }

        generateTokenAndSetCookie(user._id,res);
        res.status(200).json({
            _id:user._id,
            fullName: user.fullName,
        });
    }
    catch(error){
        console.log("Error in login controller", error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
}
export const signup = async(req,res) =>{
    try{
        const {fullName,organisation,position,email,password } = req.body;
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({error:"User already exists"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const newUser = new User({
            fullName,
            organisation,
            position,
            email,
            password: hashedPassword
        })

        if(newUser){
            generateTokenAndSetCookie(newUser._id,res);
            await newUser.save();

            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName
            })
        }else{
            res.status(400).json({error:"Invalid user data!"});
        }

    }catch(error){
        console.log("Error in signup connection ", error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
}

export const logout = async (req,res) =>{
    try{
        res.cookie("jwt","",{maxAge:0});
        res.status(500).json({message: "Logged out successfully"});
    } catch (error) {
        console.log("Error in logout connection ", error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
}