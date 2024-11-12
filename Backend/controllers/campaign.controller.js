import Campaign from "../models/campaign.model.js";
import User from "../models/user.model.js";

export const create = async(req,res) =>{
    try{
        const {title,description,public_key,target} = req.body;
        const userId = req.user._id;
        const user = await User.findById(userId);
        if(!user){
            return res.status(400).json({error:"User not found to create campaign"});
        }
        const campaign = await Campaign.findOne({title});
        if(campaign){
            return res.status(400).json({error:"Campaign already exists"});
        }
        const organisation = user.organisation;
        const newCampaign = new Campaign({
            title,
            organisation,description,
            public_key,
            target,
            userId
        })
        user.campaigns.push(newCampaign);
        await user.save();
        await newCampaign.save();

        return res.status(201).json(newCampaign);
    }
    catch(error){
        console.log("Error in createCampaign controller ", error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
}

export const getAll = async(req,res) =>{
    try{
        const campaigns = await Campaign.find();
        return res.status(200).json(campaigns);
    }
    catch(error){
        console.log("Error in getAll campaign controller ", error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
}
export const updateDonation = async(req,res) => {
    try{
        const {donation_amt} = req.body;
        const _id = req.params.id;
        await Campaign.updateOne({_id},{$set:{donation_amt:donation_amt}});
        return res.status(200).json({message:"updated successfully"});
    }
    catch(error){
        console.log("Error in updateDonation campaign controller ", error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
}