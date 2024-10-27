import asynchandler from '../utils/asynchandler.js'
import apires from "../utils/apires.js"
import apierr from "../utils/apierr.js"
import User from "../models/user.model.js"
import Approver from "../models/approver.model.js"
import bcrypt from "bcrypt"

const getaccesstokenandrefreshtoken=async (user)=>{
    const accesstoken=await user.genrateaccesstoken()
    const refreshtoken=await user.genraterefreshtoken()
    user.refreshtoken=refreshtoken
    await user.save({validateBeforeSave:"flase"})
    return {accesstoken,refreshtoken}
}

const registeruser=asynchandler(async(req,res)=>{
    const {name,email,password,rollno,mobilenumber,hosteldetails}=req.body
    if (
        [name,email,password,rollno,mobilenumber,hosteldetails].some((value)=>value?.trim()==="")
    ) {
        throw new apierr(400,"All fields are required") 
    }
    const olduser=await User.findOne({
        $or:[{rollno},{email}]
    })
    if(olduser){
        throw new apierr(409,"User already exists try login")
    }
    else{
    const newuser=await User.create({
        name,
        email,
        rollno,
        mobilenumber,
        password,
        hosteldetails
    })
    const createduser=await User.findById(newuser._id)
    if(!createduser){
        throw new apierr(500,"Something went wrong while registering, please try after sometime")
    }
    return res.status(200).json(
        new apires(200,createduser,"User registered successfully")
    )
}
})

const loginuser=asynchandler(async (req,res) => {
    const {email,password}=req.body
    if(email.trim()===""){
        throw new apierr(400,"Please enter email")
    }
    if(password.trim()===""){
        throw new apierr(400,"Please enter password")
    }
    const olduser=await User.findOne({
        $or:[{email},{password}]
    })
    if(!olduser){
        throw new apierr(404,"User does not exists,try to signup or enter correct details")
    }
    const passwordcheck=await olduser.ispasswordcorrect(password)
    if(!passwordcheck){
        throw new apierr(401,"Invaild user credentials")
    }
    const {accesstoken,refreshtoken}=await getaccesstokenandrefreshtoken(olduser)
    const options={
        httpOnly:true
    }
    const loggeduser=await User.findById(olduser._id).select('-password -refreshtoken')
    return res.status(200)
    .cookie("accesstoken",accesstoken,options)
    .cookie("refreshtoken",refreshtoken,options)
    .json(
        new apires(200,loggeduser,"User loggedin successfully")
    )
})

const logoutuser=asynchandler(async(req,res)=>{
    // console.log(req.user._id)
    await User.findByIdAndUpdate(
        req.user._id,
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
    .json(new apires(200,{},"User logged out successfully"))
})

const casualrequest=asynchandler(async (req,res) => {
    const {date,outtime,intime,place,reason}=req.body
    const hosteldetails=req.user.hosteldetails
    const approver=await Approver.findOne({
        $and:[{hosteldetails},{
            assignedwork:"casualleaveapprover"
        }]
    })
    const user=req.user._id
    const casualleavedata= {
        date,
        outtime,
        intime,
        place,
        reason,
        user    
    };
    const updatedapproverdetails=await Approver.findByIdAndUpdate(
        approver._id,
        { $push: { casualleaves: casualleavedata } },
        {new:true}
    )

    const updateduserdetails=await User.findByIdAndUpdate(
        user,
        {$push:{casualleaves:updatedapproverdetails.casualleaves[updatedapproverdetails.casualleaves.length-1]}},
        {new:true}
    )

    return res.status(200).json(
        new apires(200,{"leaveid":updateduserdetails.casualleaves[updatedapproverdetails.casualleaves.length-1]._id},"successfully added casualleave")
    )

    
})

const medicalrequest=asynchandler(async (req,res) => {
    const {date,reason,toemail}=req.body
    const approver=await Approver.findOne({
        email:toemail
    })
    if(!approver){
        throw new apierr(401,"Please enter correct emailtosend leaverequest")
    }
    const user=req.user._id
    const medicalleavedata= {
        date,
        reason,
        user,
        toemail   
    };
    const updatedapproverdetails=await Approver.findByIdAndUpdate(
        approver._id,
        { $push: { medicalleaves: medicalleavedata } },
        {new:true}
    )
    const updateduserdetails=await User.findByIdAndUpdate(
        user,
        {$push:{medicalleaves:updatedapproverdetails.medicalleaves[updatedapproverdetails.medicalleaves.length-1]}},
        {new:true}
    )
    res.status(200).json(
        new apires(200,{"leaveid":updateduserdetails.medicalleaves[updatedapproverdetails.medicalleaves.length-1]._id},"successfully added medicalleave")
    )   
})

const longrequest=asynchandler(async (req,res) => {
    const {fromdate,todate,place,reason,emergencycontact}=req.body
    const approver=await Approver.findOne({
        assignedwork:"longleaveapprover"
    })
    const user=req.user._id
    console.log(user)
    const longleavedata= {
        fromdate,
        todate,
        emergencycontact,
        place,
        reason,
        user    
    }
    const updatedapproverdetails=await Approver.findByIdAndUpdate(
        approver._id,
        { $push: { longleaves: longleavedata } },
        {new:true}
    )
    const updateduserdetails=await User.findByIdAndUpdate(
        user,
        {$push:{longleaves:updatedapproverdetails.longleaves[updatedapproverdetails.longleaves.length-1]}},
        {new:true}
    )
    res.status(200).json(
        new apires(200,{"leaveid":updateduserdetails.longleaves[updatedapproverdetails.longleaves.length-1]._id},"successfully added longleave")
    )   
})

const getpendingleaves=asynchandler(async (req,res) => {
    const pendingleaves=await User.find({
        "_id": req.user._id,  
        $or: [
          { "casualleaves.status": "pending" },
          { "medicalleaves.status": "pending" },
          { "longleaves.status": "pending" }
        ]
      }, {
        casualleaves: { $elemMatch: { status: "pending" } },
        medicalleaves: { $elemMatch: { status: "pending" } },
        longleaves: { $elemMatch: { status: "pending" } }
      })
    console.log(pendingleaves)
    
    return res.status(200).json(
        new apires(200,{"pendingcasualleaves":pendingleaves[0]?.casualleaves,"pendingmedicalleaves":pendingleaves[0]?.medicalleaves,"pendinglongleaves":pendingleaves[0]?.longleaves},"Fechted successfully")
    )
})

const getapprovedleaves=asynchandler(async (req,res) => {
    const approvedleaves=await User.find({
        "_id": req.user._id,  
        $or: [
          { "casualleaves.status": "approved" },
          { "medicalleaves.status": "approved" },
          { "longleaves.status": "approved" }
        ]
      }, {
        casualleaves: { $elemMatch: { status: "approved" } },
        medicalleaves: { $elemMatch: { status: "approved" } },
        longleaves: { $elemMatch: { status: "approved" } }
      })
    // console.log(approvedleaves[0].casualleaves)
    return res.status(200).json(
        new apires(200,{"approvedcasualleaves":approvedleaves[0].casualleaves,"approvedmedicalleaves":approvedleaves[0].medicalleaves,"approvedlongleaves":approvedleaves[0].longleaves},"Fechted successfully")
    )
})

const edituser=asynchandler(async (req,res) => {
    const userId = req.user._id;
    const existingProfile = await User.findById(userId);

    const updatedFields = {};
    for (const field in req.body) {
      if (req.body[field] !== existingProfile[field]) {
        // Skip 'email' and 'rollno' fields
        if (field === 'email' || field === 'rollno') {
            throw new apierr(400,"Chanenot change eamil or rollno,If you want to change try contacting admin")
        }

        // Check if the field is the password
        if (field === 'password') {
          // Hash the new password
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
          updatedFields.password = hashedPassword;
        } else {
          updatedFields[field] = req.body[field];
        }
      }
    }

    // Update only if there are changes
    if (Object.keys(updatedFields).length > 0) {
      await User.findByIdAndUpdate(userId, { $set: updatedFields });
      res.status(200).json(
        new apires(200, updatedFields,"Profile updated successfully"));
    } else {
      res.status(200).json(
        new apires(200,{},"No changes detected"));
    }
  }
)

const userhistory=asynchandler(async (req,res) => {

    const user = await User.findById(req.user._id);

if (user) {
  // Combine all leave arrays into one array
  const allLeaves = [
    ...user.casualleaves,
    ...user.medicalleaves,
    ...user.longleaves
  ];

  // Sort the combined array by createdAt in ascending order
  allLeaves.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

//   console.log(allLeaves);
  res.status(200).json(
    new apires(200,allLeaves,"fetched history")
  ) 
}
else{
    throw new apierr(400,"User doesnot exists")
}

})

const getuserdetails=asynchandler(async (req,res) => {
    const user=await User.findById(req.user._id)
    if(!user){
        throw new apierr(400,"User not find")
    }
    res.status(200).json(
        new apires(200,user,"fetched user details")
    )
})

export { registeruser,loginuser,logoutuser,casualrequest,longrequest,medicalrequest,getpendingleaves,getapprovedleaves,edituser,userhistory ,getuserdetails}