import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import casualrequestschema from "../schemas/casualleave.js";
import longrequestschema from "../schemas/longleave.js";
import medicalrequestschema from "../schemas/medicalleave.js";

const userschema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    rollno:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:[true,"password is requiredd"],
        unique:true
    },
    mobilenumber:{
        type:Number,
        required:true
    },
    hosteldetails:{
        type:String,
        required:true
    },
    refreshtoken:{
        type:String
    },
    casualleaves:[casualrequestschema],
    medicalleaves:[medicalrequestschema],
    longleaves:[longrequestschema]
},{timestamps:true})

userschema.pre("save",async function (next) {
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,10)
        next()
    }
    else{
        next()
    }
})

userschema.methods.ispasswordcorrect=function(enteredpassword) {
    return bcrypt.compare(enteredpassword,this.password)
}

userschema.methods.genrateaccesstoken=function () {
    return jwt.sign({
        _id:this._id,
        email:this.email,
        name:this.name
    },process.env.ACCESSTOKENSECRET,{
        expiresIn:process.env.ACCESSTOKENEXPIRY
    })
}

userschema.methods.genraterefreshtoken=function () {
    return jwt.sign({
        _id:this._id
    },process.env.REFRESHTOKENSECRET,{
        expiresIn:process.env.REFRESHTOKENEXPIRY
    })
}



const User=mongoose.model("user",userschema)
export default User 