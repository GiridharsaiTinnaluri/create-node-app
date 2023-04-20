// importing libraries
const route = require('express').Router();
const passport = require('passport');

// importing modules
const userController = require('../controllers/userController');
const user = require('../models/user');

// Home route
route.get('/', (req, res)=>{
    res.redirect('/users/signUp');
})

route.get('/signIn', userController.userSignIn);
route.get('/signUp', userController.userSignUp);
route.post('/create', userController.create);
route.get('/profile', passport.checkAuthentication, userController.profile);

// passport as middleware to authenticate
route.post('/createSession', 
                passport.authenticate(
                    'local', 
                    {failureRedirect: '/users/signIn'}
                ), userController.createSession
            );

//google auth routes using passport
route.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));
route.get('/auth/google/callback', 
passport.authenticate('google', {failureRedirect: '/users/signIn'}),
userController.createSession
);

// sign Out route
route.get('/signOut', passport.checkAuthentication, userController.signOut);

//reset password route
route.get('/resetPassword', passport.checkAuthentication, userController.resetPassword);
route.post('/resetPassword', passport.checkAuthentication, userController.createNewPassword);

//Forgot password
route.get('/forgotPassword', userController.forgotPassword);
route.post('/forgotPassword', userController.sendForgotPasswordLinkToUserMail);
route.get('/resetForgotPassword/:id/:token', userController.resetForgotPassword);
route.post('/resetForgotPassword/:id/:token', userController.postresetForgotPassword);

module.exports = route