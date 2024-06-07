import express from 'express';
import { twitterAuth, twitterAuthCallback, redirectToTweet } from '../controllers/authController.js';

const router = express.Router();

router.get('/auth/twitter', twitterAuth);
router.get('/auth/twitter/callback', twitterAuthCallback, redirectToTweet);

export default router;