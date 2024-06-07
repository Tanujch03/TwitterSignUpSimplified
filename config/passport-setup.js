import passport from 'passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';

passport.use(new TwitterStrategy({
    consumerKey: process.env.CONSUMER_KEY,
    consumerSecret: process.env.CONSUMER_SECRET,
    callbackURL: 'http://localhost:3000/auth/twitter/callback'
}, (token, tokenSecret, profile, cb) => {
    const user = { token, tokenSecret, profile };
    return cb(null, user);
}));

passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((obj, cb) => cb(null, obj));