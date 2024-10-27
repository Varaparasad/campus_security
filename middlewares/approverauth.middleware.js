import asynchandler from "../utils/asynchandler.js";
import jwt from "jsonwebtoken";
import apierr from "../utils/apierr.js";
import Approver from "../models/approver.model.js";
const verifyapproverjwt=asynchandler(async(req,res,next)=>{
    try {
        const token=req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer ", "")
        if(!token){
            throw new apierr(401,"Unauthorized request")
        }
        const decodedtoken=jwt.verify(token,process.env.ACCESSTOKENSECRET)
        const newapprover=await Approver.findById(decodedtoken?._id).select("-password -refreshtoken")
        if(!newapprover){
            throw new apierr(401,"Invalid accesstoken")
        }
        req.approver=newapprover
        next()
    } catch (error) {
        throw new apierr(401,error?.message || "Invalid accesstoken")
    }
})

export default verifyapproverjwt