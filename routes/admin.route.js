import express,{Router} from "express"
const adminroute=Router()
import verifyadminjwt from "../middlewares/adminauth.middleware.js"
import { registeradmin,loginadmin,logoutadmin,createapprover } from "../controllers/admin.controller.js"
adminroute.post('/register',registeradmin)
adminroute.post('/login',loginadmin)
adminroute.post('/logout',verifyadminjwt,logoutadmin)
adminroute.post('/createapprover',verifyadminjwt,createapprover)

export default adminroute