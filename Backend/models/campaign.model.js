import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    organisation: {
        type: String,
        required:true,
    },
    description: {
        type:String,
        required: true,
    },
    public_key:{
        type: String,
        required: true,
        unique:true
    },
    target:{
        type:Number,
        required:true,
        default:0
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    donation_amt: {
        type: Number,
        default:0
    }
});

const Campaign = mongoose.model("Campaign",campaignSchema);

export default Campaign;