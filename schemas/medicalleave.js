import mongoose, { Schema } from "mongoose";
const medicalrequestschema=new mongoose.Schema({
    date:{
        type:String,
        required:true
    },
    reason:{
        type:String,
        required:true
    },
    toemail:{
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

export default medicalrequestschema