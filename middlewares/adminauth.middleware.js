import asynchandler from "../utils/asynchandler.js";
import jwt from "jsonwebtoken";
import apierr from "../utils/apierr.js";
import Admin from "../models/admin.model.js";
const verifyadminjwt=asynchandler(async(req,res,next)=>{
    try {
        const token=req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer ", "")
        if(!token){
            throw new apierr(401,"Unauthorized request")
        }
        const decodedtoken=jwt.verify(token,process.env.ACCESSTOKENSECRET)
        const newadmin=Admin.findById(decodedtoken?._id).select("-password -refreshtoken")
        if(!newadmin){
            throw new apierr(401,"Invalid accesstoken")
        }
        req.admin=newadmin
        next()
    } catch (error) {
        throw new apierr(401,error?.message || "Invalid accesstoken")
    }
})

export default verifyadminjwt