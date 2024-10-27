import asynchandler from '../utils/asynchandler.js'
import apires from "../utils/apires.js"
import apierr from "../utils/apierr.js"
import Admin from "../models/admin.model.js"
import Approver from "../models/approver.model.js"

const getaccesstokenandrefreshtoken=async (admin)=>{
    const accesstoken=await admin.genrateaccesstoken()
    const refreshtoken=await admin.genraterefreshtoken()
    admin.refreshtoken=refreshtoken
    await admin.save({validateBeforeSave:"flase"})
    return {accesstoken,refreshtoken}
}

const registeradmin=asynchandler(async(req,res)=>{
    const {name,email,password,mobilenumber}=req.body
    if (
        [name,email,password,mobilenumber].some((value)=>value?.trim()==="")
    ) {
        throw new apierr(400,"All fields are required") 
    }
    const oldadmin=await Admin.findOne({
        email
    })
    if(oldadmin){
        throw new apierr(409,"Admin already exists try login")
    }
    else{
    const newadmin=await Admin.create({
        name,
        email,
        mobilenumber,
        password
    })
    const createdadmin=await Admin.findById(newadmin._id)
    if(!createdadmin){
        throw new apierr(500,"Something went wrong while registering, please try after sometime")
    }
    return res.status(200).json(
        new apires(200,createdadmin,"Admin registered successfully")
    )
}
})

const loginadmin=asynchandler(async (req,res) => {
    const {email,password}=req.body
    if(email.trim()===""){
        throw new apierr(400,"Please enter email")
    }
    if(password.trim()===""){
        throw new apierr(400,"Please enter password")
    }
    const oldadmin=await Admin.findOne({
        email
    })
    if(!oldadmin){
        throw new apierr(404,"Admin does not exists,try to signup or enter correct details")
    }
    const passwordcheck=await oldadmin.ispasswordcorrect(password)
    if(!passwordcheck){
        throw new apierr(401,"Invaild admin credentials")
    }
    const {accesstoken,refreshtoken}=await getaccesstokenandrefreshtoken(oldadmin)
    const options={
        httpOnly:true
    }
    const loggedadmin=await Admin.findById(oldadmin._id).select('-password -refreshtoken')
    return res.status(200)
    .cookie("accesstoken",accesstoken,options)
    .cookie("refreshtoken",refreshtoken,options)
    .json(
        new apires(200,loggedadmin,"Admin loggedin successfully")
    )
})

const logoutadmin=asynchandler(async(req,res)=>{
    // console.log(req.admin._conditions._id)
    await Admin.findByIdAndUpdate(
        req.admin._conditions._id,
        {
            $unset:{
                refreshtoken:1
            }
        },
        {
            new:true
        }
    )
    const options={
        httpOnly:true,
        secure:true
    }
    return res.status(200)
    .clearCookie("accesstoken",options)
    .clearCookie("refreshtoken",options)
    .json(new apires(200,{},"Admin logged out successfully"))
})


const createapprover=asynchandler(async (req,res) => {
    const {name,email,mobilenumber,password,assignedwork,hosteldetails}=req.body
    if (
        [name,email,mobilenumber,password,assignedwork,hosteldetails].some((field) => field?.trim === "")
    ) {
        throw new apierr(400,"All fields are required") 
    }
    const oldapprover=await Approver.findOne({
        email
    })
    if(oldapprover){
        throw new apierr(409,"Approver already exists try login")
    }
    else{
    const newapprover=await Approver.create({
        name,
        email,
        mobilenumber,
        password,
        assignedwork,
        hosteldetails
    })
    const createdapprover=await Approver.findById(newapprover._id)
    if(!createdapprover){
        throw new apierr(500,"Something went wrong while registering, please try after sometime")
    }
    return res.status(200).json(
        new apires(200,createdapprover,"Approver registered successfully")
    )
}
})


export { registeradmin,loginadmin,logoutadmin,createapprover }