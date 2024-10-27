import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import casualrequestschema from "../schemas/casualleave.js";
import longrequestschema from "../schemas/longleave.js";
import medicalrequestschema from "../schemas/medicalleave.js";

const approverschema=new mongoose.Schema({
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
        required:[true,"password is required"],
        unique:true
    },
    mobilenumber:{
        type:Number,
        required:true
    },
    refreshtoken:{
        type:String
    },
    assignedwork: { 
        type: String,
        required:true,
        enum: ["casualleaveapprover", "longleaveapprover", "medicalleaveapprover"]
    },
    hosteldetails:{
        type:String
    },
    casualleaves: {
        type: [casualrequestschema],
        default: [],
    },
    longleaves: {
        type: [longrequestschema],
        default: [],
    },
    medicalleaves: {
        type: [medicalrequestschema],
        default: [],
    },
},{timestamps:true})

approverschema.pre("save",async function (next) {
    if (this.assignedwork === "casualleaveapprover") {
        this.longleaves = undefined;
        this.medicalleaves = undefined;
    }
    if (this.assignedwork === "medicalleaveapprover") {
        this.longleaves = undefined;
        this.casualleaves = undefined;
    }
    if (this.assignedwork === "longleaveapprover") {
        this.medicalleaves = undefined;
        this.casualleaves = undefined;
    }
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,10)
        next()
    }
    else{
        next()
    }
})

approverschema.methods.ispasswordcorrect=function(enteredpassword) {
    return bcrypt.compare(enteredpassword,this.password)
}

approverschema.methods.genrateaccesstoken=function () {
    return jwt.sign({
        _id:this._id,
        email:this.email,
        name:this.name
    },process.env.ACCESSTOKENSECRET,{
        expiresIn:process.env.ACCESSTOKENEXPIRY
    })
}
approverschema.methods.genraterefreshtoken=function () {
    return jwt.sign({
        _id:this._id
    },process.env.REFRESHTOKENSECRET,{
        expiresIn:process.env.REFRESHTOKENEXPIRY
    })
}


const Approver=mongoose.model("approver",approverschema)
export default Approver 