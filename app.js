import express from 'express'
import apires from './utils/apires.js'
import cors from "cors"
import cookieParser from 'cookie-parser'
const app=express()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cookieParser())

app.get('/',(req,res)=>{
    res.status(200).json(
        new apires(200,{"name":"jon","age":"17"},"successfull")
    )
})


import userroute from './routes/user.route.js'
import approverroute from './routes/approver.route.js'
import adminroute from './routes/admin.route.js'
app.use('/user',userroute)
app.use("/approver",approverroute)
app.use("/admin",adminroute)

export default app