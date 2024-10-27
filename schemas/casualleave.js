import mongoose, { Schema } from "mongoose";
const casualrequestschema=new mongoose.Schema({
    date:{
        type:String,
        required:true
    },
    outtime:{
        type:String,
        required:true
    },
    intime:{
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
    status:{
        type:String,
        default:"pending"
    },
    remarks:{
        type:String,
        default:""
    }
},{timestamps:true})

export default casualrequestschema