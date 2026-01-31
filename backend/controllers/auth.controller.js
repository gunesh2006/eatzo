

import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import genToken from "../utils/token.js";
import { sendOtpMail } from "../utils/mail.js";


// signUp controller
export const signUp=async(req,res)=>{
    try{
        const {fullName,email,password,mobile,role}=req.body;
        let user=await User.findOne({email});

        if(user){
            return res.status(400).json({message:"User Already Exists."})
        }
        if(password.length<6){
            return res.status(400).json({message:"Password should contain atleast six characters"})
        }
        if(mobile.length!=10){
            return res.status(400).json({message:"mobile no. should have 10 digits"})
        }

        const hashedPassword=await bcrypt.hash(password,10);
        user=await User.create({
            fullName,
            email,
            password:hashedPassword,
            mobile,
            role
        })

        const token=await genToken(user._id);
        res.cookie("token",token,{
            secure:false, //true in production
            sameSite:"strict",
            maxAge:7*24*60*60*1000,
            httpOnly:true,
        })

        return res.status(201).json(user);
    }catch(error){
        return res.status(500).json({message:`Signup Error : ${error.message}`})
    }
}


// signIn controller
export const signIn=async(req,res)=>{
    try{
        const {email,password}=req.body;
        let user=await User.findOne({email});

        if(!user){
            return res.status(400).json({message:"User Not Exists"})
        }
        
        const isMatch=await bcrypt.compare(password,user.password);
        
        if(!isMatch){
            return res.status(400).json({message:"Incorrect Password"})
        }

        const token=await genToken(user._id);
        res.cookie("token",token,{
            secure:false, //true in production
            sameSite:"strict",
            maxAge:7*24*60*60*1000,
            httpOnly:true,
        })

        return res.status(200).json(user);
    }catch(error){
        return res.status(500).json({message:`SignIn Error : ${error.message}`})
    }
}

//signOut controller

export const signOut=async(req,res)=>{
    try{
        res.clearCookie("token");
        res.status(200).json({message:"Sign Out successfully"})
    }catch(error){
        return res.status(500).json({message:`SignOut Error : ${error.message}`})
    }
}

//send otp controller
export const sendOtp=async(req,res)=>{
    try{
        const {email}=req.body;
        let user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"User doesn't exists"});
        }
        const otp=Math.floor(Math.random()*9000+1000).toString();
        user.resetOtp=otp;
        user.otpExpires=Date.now()+5*60*1000;
        user.isOtpVerified=false;
        await user.save();
        await sendOtpMail(email,otp);
        return res.status(200).json({message:"OTP send successfully"});
    }catch(error){
        return res.status(500).json({message:`send otp error : ${error.message}`});
    }
}

//verify otp
export const verifyOtp=async(req,res)=>{
    try{
        let {email,otp}=req.body;
        const user=await User.findOne({email});
        if(!user || user.resetOtp != otp || user.otpExpires<Date.now()){
            return res.status(400).json({message:"Invalid/Expired OTP"});
        }
        user.isOtpVerified=true;
        user.resetOtp=undefined;
        user.otpExpires=undefined;
        await user.save();
        return res.status(200).json({message:"OTP verified successfully"});
    }catch(error){
        return res.status(500).json({message:`verify otp error : ${error.message}`});
    }
}

//reset password
export const resetPassword=async(req,res)=>{
    try{
        let {email,newPassword}=req.body;
        let user=await User.findOne({email})
        if(!user || !user.isOtpVerified ){
            return res.status(400).json({message:"OTP verification required"});
        }
        const hashedNewPassword=await bcrypt.hash(newPassword,10);
        user.password=hashedNewPassword;
        user.isOtpVerified=false;
        await user.save();
         return res.status(200).json({message:"Password reset Succesfully"});
    }catch(error){
        return res.status(500).json({message:`reset password error : ${error.message}`});
    }
}

//googleauth controller(used for both sign in and sign up)
export const googleAuth=async(req,res)=>{
    try{
        let {fullName,email,mobile,role} =req.body;
        let user=await User.findOne({email});

        if(!user){
            user= await User.create({
                fullName,
                email,
                mobile,
                role
            })
        }
        const token=await genToken(user._id);
        res.cookie("token",token,{
            secure:false, //true in production
            sameSite:"strict",
            maxAge:7*24*60*60*1000,
            httpOnly:true,
        })

        return res.status(201).json(user);

    }catch(error){
        return res.status(500).json({message:"google auth controller error"});
    }
}