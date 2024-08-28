import passport from "passport";
import dotenv from 'dotenv'
import { Strategy as GitHubStrategy } from "passport-github2";
import User from '../models/user.model.js'

dotenv.config()

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

// Use the GitHubStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and GitHub
//   profile), and invoke a callback with a user object.
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    // callbackURL: "https://github-mern-app-6lgm.onrender.com/api/auth/github/callback"
    callbackURL: "http://localhost:5173/api/auth/github/callback"
},
    async function (accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        // process.nextTick(function () {

        //   // To keep the example simple, the user's GitHub profile is returned to
        //   // represent the logged-in user.  In a typical application, you would want
        //   // to associate the GitHub account with a user record in your database,
        //   // and return that user instead.
        //   return done(null, profile);
        // });
        console.log(profile);
        const user = await User.findOne({ username: profile.username })
        if (!user) {
            const newUser = new User({
                name: profile.displayName,
                username: profile.username,
                profileUrl: profile.profileUrl,
                avatarUrl: profile.photos[0].value,
                likedProfiles: [],
            })
            await newUser.save();
            done(null, newUser)
        } else {
            done(null, user)
        }
    }
));