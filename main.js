import dbconnection from "./db/connectdb.js";
import app from "./app.js";
import dotenv from "dotenv";
dotenv.config({
    path:"./.env"
})
dbconnection()
.then(
    app.listen(`${process.env.PORT}`,()=>{
        console.log(`listening at port ${process.env.PORT}`)
    })
)
.catch(
    (error)=>{
        console.log(error.message)
    }
)
