import express,{Router} from "express"
const userroute=Router()
import verifyuserjwt from "../middlewares/userauth.middleware.js"

import { registeruser ,loginuser ,logoutuser,casualrequest,longrequest,medicalrequest,getpendingleaves,getapprovedleaves,edituser,userhistory,getuserdetails} from "../controllers/user.controller.js"
userroute.post('/register',registeruser)
userroute.post('/login',loginuser)
userroute.post('/logout',verifyuserjwt,logoutuser)

userroute.put('/casualleaverequest',verifyuserjwt,casualrequest)
userroute.put('/longleaverequest',verifyuserjwt,longrequest)
userroute.put('/medicalleaverequest',verifyuserjwt,medicalrequest)

userroute.get('/getpendingleaves',verifyuserjwt,getpendingleaves)
userroute.get('/getapprovedleaves',verifyuserjwt,getapprovedleaves)
userroute.get('/gethistory',verifyuserjwt,userhistory)
userroute.get('/getuserdetails',verifyuserjwt,getuserdetails)

userroute.post('/editprofile',verifyuserjwt,edituser)

export default userroute