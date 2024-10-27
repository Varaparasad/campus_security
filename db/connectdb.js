import mongoose from "mongoose";
const dbconnection=async()=>{
try {
    const connection=await mongoose.connect(`${process.env.MONGODB_URL}/leaverequest`)
    console.log({
        "message":"mongodb connected successfully",
        "connectedAt":connection.connection.host,
        "sucsess":"true"
    })
} catch (error) {
    console.log(error)
    process.exit(1)
}
}


export default dbconnection