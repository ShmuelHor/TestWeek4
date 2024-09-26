import express, { Router } from 'express';
import {CreateBeeper,GetAllBeepers,GetBeeperById,deleteBeeper,GetBeeperByStatus,UpdateStatusBeeper} from '../controllers/authController.js';

const router: Router = express.Router();
router.route('/beepers').post(CreateBeeper).get(GetAllBeepers);
router.route('/beepers/:id').get(GetBeeperById).delete(deleteBeeper);
router.route('/beepers/status/:status').get(GetBeeperByStatus);
router.route('/beepers/:id/status').put(UpdateStatusBeeper);
export default router;