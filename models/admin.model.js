import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
const adminschema=new mongoose.Schema({
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
    password:{
        type:String,
        required:[true,"password is requiredd"],
        unique:true
    },
    mobilenumber:{
        type:Number,
        required:true
    },
    refreshtoken:{
        type:String
    }
},{timestamps:true})

adminschema.pre("save",async function (next) {
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,10)
        next()
    }
    else{
        next()
    }
})

adminschema.methods.ispasswordcorrect=function(enteredpassword) {
    return bcrypt.compare(enteredpassword,this.password)
}

adminschema.methods.genrateaccesstoken=function () {
    return jwt.sign({
        _id:this._id,
        email:this.email,
        name:this.name
    },process.env.ACCESSTOKENSECRET,{
        expiresIn:process.env.ACCESSTOKENEXPIRY
    })
}
adminschema.methods.genraterefreshtoken=function () {
    return jwt.sign({
        _id:this._id
    },process.env.REFRESHTOKENSECRET,{
        expiresIn:process.env.REFRESHTOKENEXPIRY
    })
}


const Admin=mongoose.model("admin",adminschema)
export default Admin 