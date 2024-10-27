import asynchandler from '../utils/asynchandler.js'
import apires from "../utils/apires.js"
import apierr from "../utils/apierr.js"
import Approver from "../models/approver.model.js"
import User from "../models/user.model.js"

const getaccesstokenandrefreshtoken=async (approver)=>{
    const accesstoken=await approver.genrateaccesstoken()
    const refreshtoken=await approver.genraterefreshtoken()
    approver.refreshtoken=refreshtoken
    await approver.save({validateBeforeSave:"flase"})
    return {accesstoken,refreshtoken}
}

// const registerapprover=asynchandler(async(req,res)=>{
//     const {name,email,password,rollno,mobilenumber,assignedwork}=req.body
//     if (
//         [name,email,password,rollno,mobilenumber].some((value)=>value?.trim()==="")
//     ) {
//         throw new apierr(400,"All fields are required") 
//     }
//     const oldapprover=await Approver.findOne({
//         email
//     })
//     if(oldapprover){
//         throw new apierr(409,"Approver already exists try login")
//     }
//     else{
//     const newapprover=await Approver.create({
//         name,
//         email,
//         rollno,
//         mobilenumber,
//         password
//     })
//     const createdapprover=await Approver.findById(newapprover._id)
//     if(!createdapprover){
//         throw new apierr(500,"Something went wrong while registering, please try after sometime")
//     }
//     return res.status(200).json(
//         new apires(200,createdapprover,"Approver registered successfully")
//     )
// }
// })

const loginapprover=asynchandler(async (req,res) => {
    const {email,password}=req.body
    if(email.trim()===""){
        throw new apierr(400,"Please enter email")
    }
    if(password.trim()===""){
        throw new apierr(400,"Please enter password")
    }
    const oldapprover=await Approver.findOne({
        email
    })
    if(!oldapprover){
        throw new apierr(404,"Approver does not exists,try contacting admin")
    }
    const passwordcheck=await oldapprover.ispasswordcorrect(password)
    if(!passwordcheck){
        throw new apierr(401,"Invaild approver credentials")
    }
    const {accesstoken,refreshtoken}=await getaccesstokenandrefreshtoken(oldapprover)
    const options={
        httpOnly:true
    }
    const loggedapprover=await Approver.findById(oldapprover._id).select('-password -refreshtoken')
    return res.status(200)
    .cookie("accesstoken",accesstoken,options)
    .cookie("refreshtoken",refreshtoken,options)
    .json(
        new apires(200,loggedapprover,"Approver loggedin successfully")
    )
})

const logoutapprover=asynchandler(async(req,res)=>{
    // console.log(req.approver._conditions._id)
    await Approver.findByIdAndUpdate(
        req.approver._id,
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
    .json(new apires(200,{},"Approver logged out successfully"))
})

const approvingleave=asynchandler(async (req,res) => {
    const {remarks}=req.body
    const flag=req.params.flag
    const leaveid=req.params.leaveid
    const assingedwork=req.approver.assignedwork
    const firstterm=assingedwork.split('leave')[0]
    const leave=`${firstterm}leaves`
    var status=""
    if(flag==="true"){
        status="approved"
    }
    else{
        status="reject"
    }
    // console.log(flag,leaveid)
    
    // const updatedapproverdetails=await Approver.findByIdAndUpdate(
    //     req.approver._id,
    //     {
    //         $set: {
    //           "casualleaves.$[element].status": "approved",       // set new status
    //           "casualleaves.$[element].remarks": "Approved for outing" // set new remarks
    //         }
    //       },
    //       {
    //         arrayFilters: [{ "element._id": ObjectId("671d4882d7cd687d87743c6a") }], // filter to target specific array element
    //         returnDocument: "after" // to return the updated document
    //       }
    // )

    const updatedapproverdetails=await Approver.findOneAndUpdate(
        { [`${leave}._id`]: leaveid, [`${leave}.status`]: "pending" }, 
        {
          $set: {
            [`${leave}.$[element].status`]: status,       
            [`${leave}.$[element].remarks`]: remarks 
          }
        },
        {
          arrayFilters: [{ "element._id": leaveid }],
          returnDocument: "after" 
        },
        {new:true}
      )
    if(!updatedapproverdetails){
        throw new apierr(400,"Leave request not available")
    }
    const updateduserdetails=await User.findOneAndUpdate(
        { [`${leave}._id`]: leaveid, [`${leave}.status`]: "pending" }, 
        {
          $set: {
            [`${leave}.$[element].status`]: status,      
            [`${leave}.$[element].remarks`]: remarks 
          }
        },
        {
          arrayFilters: [{ "element._id": leaveid}], 
          returnDocument: "after"
        }
      )
      if(!updateduserdetails){
        throw new apierr(400,"Leave request not available")
    }

      return res.status(200).json(
        new apires(200,{"updatedapprover":updatedapproverdetails,"updateduser":updateduserdetails},"Changed successfully")
      )
})


const getpendingleaves=asynchandler(async (req,res) => {
    const pendingleaves=await Approver.find({
        "_id": req.approver._id,  
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
    // console.log(pendingleaves)
    
    return res.status(200).json(
        new apires(200,{"pendingcasualleaves":pendingleaves[0]?.casualleaves,"pendingmedicalleaves":pendingleaves[0]?.medicalleaves,"pendinglongleaves":pendingleaves[0]?.longleaves},"Fechted successfully")
    )
})

const getapprovedleaves=asynchandler(async (req,res) => {
    const approvedleaves=await Approver.find({
        "_id": req.approver._id,  
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
        new apires(200,{"approvedcasualleaves":approvedleaves[0]?.casualleaves,"approvedmedicalleaves":approvedleaves[0]?.medicalleaves,"approvedlongleaves":approvedleaves[0]?.longleaves},"Fechted successfully")
    )
})


export { loginapprover,logoutapprover,approvingleave ,getpendingleaves,getapprovedleaves}