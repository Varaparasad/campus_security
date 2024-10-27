import mongoose, { Schema } from "mongoose";
const longrequestschema=new mongoose.Schema({
    fromdate:{
        type:String,
        required:true
    },
    todate:{
        type:String,
        required:true
    },
    place:{
        type:String,
        required:true
    },
    reason:{
        type:String,
        required:true
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:"user"
    },
    emergencycontact:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        default:"pending"
    },
    remarks:{
        type:String,
        default:""
    }
},{timestamps:true})

export default longrequestschema