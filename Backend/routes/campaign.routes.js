import express from 'express';
import {create, getAll, updateDonation} from '../controllers/campaign.controller.js';
import protectRoute from '../middleware/protectRoute.js';
const router = express.Router();

router.post('/create',protectRoute,create);
router.get('/getCampaigns',protectRoute,getAll);
router.post('/update/:id',updateDonation);
export default router;