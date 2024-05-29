import { writeTweet } from '../services/twitterService.js';

export const showTweetPage = (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.sendFile('tweet.html', { root: './views' });
};

export const postTweet = async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }
    const { tweet } = req.body;

    try {
        const messageResponse = await writeTweet(req.user, tweet);
        res.send(`<h1>Tweet Sent!</h1><p>${JSON.stringify(messageResponse)}</p>`);
    } catch (error) {
        res.send(`<h1>Error</h1><p>${error.message}</p>`);
    }
};