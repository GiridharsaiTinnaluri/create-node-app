const passport = require('passport');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
const USER = require('../models/user');

// authentication using passport 
passport.use(new LocalStrategy({
         usernameField: 'email',
         passReqToCallback: true
    },
    async function(req, email, password, done) {
        //find a user and establish the identity
      try { 
            const user = await USER.findOne({ email: email });
            if(!user|| user.length < 1) {
                req.flash('error', 'Invalid Username/Password');
                return done(null, false);
            }

            const isPassMatched = await bcrypt.compare(password, user.password);
            if(!isPassMatched) {
                req.flash('error', 'Invalid Username/Password');
                return done(null, false);
            }

            return done(null, user);
      }catch(err) {
            req.flash("error", 'internal server error');
            return done(err);
      }

    }
));

// serializing the user to decide which key is to kept in cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
});

// deserializing the user from  the key in th cookies
passport.deserializeUser(async function(id, done) {
    try{
    const user = await USER.findById(id);
    
    if(!user) {
        console.log('Error on desearlizing user in passport');
        return done(err);
    }

    return done(null, user);
    } catch(err) {
        console.log('Error on desearlizing user in passport');
        return done(err);
    }
})

passport.checkAuthentication = function (req, res, next) {

    if(req.isAuthenticated()) {
        return next();
    }

    //if the user is not signed in
    return res.redirect('/users/signIn');
}

passport.setAuthenticatedUser = function(req, res, next) {
    if(req.isAuthenticated()) {
        res.locals.user = req.user;
    }

    next();
}

module.exports = passport;