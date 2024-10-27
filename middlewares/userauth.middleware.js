import asynchandler from "../utils/asynchandler.js";
import jwt from "jsonwebtoken";
import apierr from "../utils/apierr.js";
import User from "../models/user.model.js";
const verifyuserjwt=asynchandler(async(req,res,next)=>{
    try {
        const token=req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer ", "")
        if(!token){
            throw new apierr(401,"Unauthorized request")
        }
        const decodedtoken=jwt.verify(token,process.env.ACCESSTOKENSECRET)
        const newuser=await User.findById(decodedtoken?._id).select("-password -refreshtoken")
        // console.log(newuser)
        if(!newuser){
            throw new apierr(401,"Invalid accesstoken")
        }
        req.user=newuser
        next()
    } catch (error) {
        throw new apierr(401,error?.message || "Invalid accesstoken")
    }
})

export default verifyuserjwt