import express,{Router} from "express"
const approverroute=Router()
import verifyapproverjwt from "../middlewares/approverauth.middleware.js"
import { loginapprover,logoutapprover,approvingleave ,getapprovedleaves,getpendingleaves} from "../controllers/approver.controller.js"
// approverroute.post('/register',registerapprover)
approverroute.post('/login',loginapprover)
approverroute.post('/logout',verifyapproverjwt,logoutapprover)
approverroute.put('/:leaveid/:flag/approving',verifyapproverjwt,approvingleave)


approverroute.get('/getpendingleaves',verifyapproverjwt,getpendingleaves)
approverroute.get('/getapprovedleaves',verifyapproverjwt,getapprovedleaves)

export default approverroute