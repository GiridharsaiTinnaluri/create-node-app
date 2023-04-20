const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');

const USER = require('../models/user');

// passing new google-oauth strategy to the passport
passport.use(new googleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: `${process.env.LOCALHOST}/users/auth/google/callback`
},
 async function(accessToken, refreshToken, profile, done) {
    //find a user
    try {
       const user = await USER.findOne({email: profile.emails[0].value})
  
              if(user) {
                  // if found, set this user as a req.user
                  return done(null, user);
              } else {
                  // if not found, create and set it as a user
                  USER.create({
                      name: profile.displayName,
                      email: profile.emails[0].value,
                      password: crypto.randomBytes(20).toString('hex')
                  }).then((user) => {
                      return done(null, user)
                  }).catch((err) => {
                      console.log('error in oauth ', err)
                      return;
                  })
              }
   
    } catch(err) {
            console.log('error in google strategy-passport', err); 
            return

    }
    }
))

module.exports = passport;
