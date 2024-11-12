import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    organisation: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true 
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    password:{
        type: String, 
        required:true
    },
    campaigns:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Campaign",
        default:[],
    }]
});

const User = mongoose.model("User",userSchema);

export default User;