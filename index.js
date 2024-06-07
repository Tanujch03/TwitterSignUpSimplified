import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import bodyParser from 'body-parser';
import './config/passport-setup.js';
import authRoutes from './routes/authRoutes.js';
import tweetRoutes from './routes/tweetRoutes.js';

const app = express();

// Session setup
app.use(session({ secret: 'SECRET', resave: true, saveUninitialized: true }));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(authRoutes);
app.use(tweetRoutes);

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: './views' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});