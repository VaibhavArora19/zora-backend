import express from 'express';
import { storeFid } from '../controllers/farcaster';

const router = express.Router();

router.post('/farcaster/fid', storeFid);

export default router;