import express from 'express';
import { showTweetPage, postTweet } from '../controllers/tweetController.js';
import { ensureAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/tweet', ensureAuthenticated, showTweetPage);
router.post('/tweet', ensureAuthenticated, postTweet);

export default router;