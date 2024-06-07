import passport from "passport";

export const twitterAuth = passport.authenticate('twitter');

export const twitterAuthCallback = passport.authenticate('twitter', {
    failureRedirect: '/'
});

export const redirectToTweet = (req, res) => {
    res.redirect('/tweet');
};