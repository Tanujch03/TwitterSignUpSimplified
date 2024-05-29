
import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import bodyParser from 'body-parser';
import crypto from 'crypto';
import Oauth from 'oauth-1.0a';
import fetch from 'node-fetch';
import { URLSearchParams } from 'url';

const app = express();

// Session setup
app.use(session({ secret: 'SECRET', resave: true, saveUninitialized: true }));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

passport.use(new TwitterStrategy({
    consumerKey: process.env.CONSUMER_KEY,
    consumerSecret: process.env.CONSUMER_SECRET,
    callbackURL: 'http://localhost:3000/auth/twitter/callback'
}, (token, tokenSecret, profile, cb) => {
    // Store the token, tokenSecret, and profile in the user session
    const user = { token, tokenSecret, profile };
    return cb(null, user);
}));

passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((obj, cb) => cb(null, obj));

const oauth = Oauth({
    consumer: {
        key: process.env.CONSUMER_KEY,
        secret: process.env.CONSUMER_SECRET
    },
    signature_method: 'HMAC-SHA1',
    hash_function: (baseString, key) => crypto.createHmac('sha1', key).update(baseString).digest('base64')
});

async function writeTweet({ token, tokenSecret }, tweet) {
    const authToken = { key: token, secret: tokenSecret };

    const url = 'https://api.twitter.com/2/tweets';
    const headers = oauth.toHeader(oauth.authorize({
        url,
        method: 'POST'
    }, authToken));

    try {
        const request = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({ text: tweet }),
            headers: {
                Authorization: headers['Authorization'],
                'user-agent': 'V2CreateTweetJS',
                'content-type': 'application/json',
                'accept': 'application/json'
            }
        });
        const body = await request.json();
        return body;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send(`
        <h1>Authorize Twitter App</h1>
        <p>Please <a href="/auth/twitter">login with Twitter</a> to authorize the app.</p>
    `);
});

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback', 
    passport.authenticate('twitter', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/tweet');
    }
);

app.get('/tweet', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.send(`
        <h1>Post a Tweet</h1>
        <form action="/tweet" method="POST">
            <label for="tweet">Enter Tweet Text:</label>
            <input type="text" id="tweet" name="tweet" required>
            <br>
            <button type="submit">Submit</button>
        </form>
    `);
});

app.post('/tweet', async (req, res) => {
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
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
