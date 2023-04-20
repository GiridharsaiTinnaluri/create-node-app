//importing libraries
const USER = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const passwordMailer = require('../mailers/password_mailers');
const randomString = require('randomstring');
const jwt =  require('jsonwebtoken');

// GET - /signIn
// public route
// render the sign in page
module.exports.userSignIn = function(req, res) {
    //checking the authentication
    if(req.isAuthenticated()) {
       return res.redirect('/users/profile');
    }

    return res.render('userSignIn', {
        title: 'Sign In'
    });
}

// GET - /signUp
// public route
//render the sign up page
module.exports.userSignUp = function(req, res) {
    //checking the auth
    if(req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }

    return res.render('userSignUp', {
        title: 'Sign Up'
    });
}  

// POST - /create
// public route
//get the sign Up data and create new user
module.exports.create = async (req, res) => {
    //gets all the fields from body
    const {email, name, password, confirmPassword} = req.body

    // initilizes the variables
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const specialChars = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    //validate the body fields is not empty
    if(_.isEmpty(name.trim()) || _.isEmpty(email.trim()) || _.isEmpty(password.trim())) {
        req.flash('error', 'please enter valid data');
        return res.redirect('back');
    }
    
    // checks email field is of correct formate
    if(!emailRegex.test(email)) {
        req.flash('error', 'please enter valid Email address');
        return res.redirect('back');
    }
    //cheks name formate - special chars doesnt exists
    if(specialChars.test(name)) {
        req.flash('error', 'name doesnt contain special chars');
        return res.redirect('back');
    }
    // checks spaces exists in password
    if(/\s/.test(password)) {
        req.flash('error', 'password doesnt contain spaces');
        return res.redirect('back');
    }
    
    if(password !== confirmPassword) {
        req.flash('error', 'passwords didnt matched');
        return res.redirect('back');
    }

    // Hashing passwords
    const hashPassword = await bcrypt.hash(password, 12);
    // checking user already exists
    const user = await USER.findOne({
        email
    })
    
    if(!user) {
        // if no user found - creating one
        const newUser = USER.create({
            email,
            name,
            password: hashPassword
        })

        if(!newUser) {
            req.flash('error', 'internal server error');
            return res.redirect('back');
        }

        req.flash('success', 'signed in successfully');
        return res.redirect('/users/signIn');

    } else {
        req.flash('error', 'email already exists');
        return res.redirect('back');
    }
}

// POST - /createSession
// private route
module.exports.createSession = async (req, res) => {
    req.flash('success', 'Logged in successfully');
    return res.redirect('/users/profile');
}

// GET - /profile
// private route
//renders the user profile page
module.exports.profile = async (req,res) => {
    return res.render('profile')
}

// GET - /signOut
// private route
// destroys the session
module.exports.signOut = (req, res) => {
    //logout() is provided by the passport
    // destroys the cookies session
    req.logout(function(err){
        if(err) {
            console.log(err);
        }
        
        req.flash('success', 'Logged out successfully');
        return res.redirect('/users/signIn');
    });

}

// GET - /resetPassword
// private route
// renders the resetPassword screen
module.exports.resetPassword = (req, res) => {
    return res.render('resetPassword');
}

// POST - /resetPassword
// private route
// gets the user data to reset password
module.exports.createNewPassword = async (req, res) => {

try{
    const {email} = req.user;
    const {newPassword, newConfirmPassword} = req.body

    //validating input 
    if(/\s/.test(newPassword)) {
        req.flash('error', 'password doesnt contain spaces');
        return res.redirect('back');
    }
    
    if(newPassword !== newConfirmPassword) {
        req.flash('error', 'passwords didnt matched');
        return res.redirect('back');
    }

    // Hashing passwords
    const hashPassword = await bcrypt.hash(newPassword, 12);

    //find user and update
    const user = await USER.findOneAndUpdate({email}, {
        password: hashPassword
    }, {new: true});

    if(!user) {
        req.flash('error', 'something went wrong');
        return res.redirect('/users/signIn');
    }
    
    req.flash('success', 'password reset successfully');
    return res.redirect('/users/profile');
}catch(err) {
    req.flash('error', 'internal server error');
    return res.redirect('back');
}
}

// GET - /forgotPassword
// private route
// gets the user data to reset password
module.exports.forgotPassword = async(req, res) => {
    if(req.isAuthenticated()) {
        return res.redirect('/users/profile');
     }
    res.render('forgotPassword');
}

// POST - /forgotPassword
// public route
// verify user email and sends reset password link to the user
module.exports.sendForgotPasswordLinkToUserMail = async (req, res) => {
    
    try {
        //email from req.body
        const {email} = req.body

        //validate input
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        //check fields are not empty
        if(_.isEmpty(email.trim())) {
            req.flash('error', 'please enter valid email');
            return res.redirect('back');
        }
        //checks email is of correct format
        if(!emailRegex.test(email)) {
            req.flash('error', 'please enter valid email');
            return res.redirect('back');
        }

        //check user exists
        const user = await USER.findOne({email: email});

        if(user) {
            //user exists and now create a one time link valid for 15 mins
            const secret= process.env.JWT_SECRET + user.password;
            const payload = {
                email: user.email,
                id: user.id
            }
            const token = jwt.sign(payload, secret, {
                expiresIn: '15m'
            });
            // reset link with 15 mins expiry
            const link = `${process.env.LOCALHOST}/users/resetForgotPassword/${user.id}/${token}`

            //send link to user mail
            passwordMailer.forgotPassword(user.email, link);
            
            req.flash('success', 'Email sent to reset password!');
            return res.redirect('/users/signIn');
        } else {
            req.flash('error', 'Invalid Email');
            return res.redirect('back');
        }

    } catch(err) {
        req.flash('error', 'Something Went Wrong!');
        res.redirect('/users');
    }
}

// GET - /resetForgotPassword/:id/:token
// public route
// validates the reset URL
// renders the reset forgot password screen
module.exports.resetForgotPassword = async(req, res) => {
    try{
        //get fields from the req params
        const {id, token} = req.params;

        //validate the fields
        if(_.isEmpty(id.trim()) || _.isEmpty(token.trim())) {
            req.flash('error', 'Something went wrong');
            return res.redirect('/users/signIn');
        }
        
        //verify the id
        const user = await USER.findOne({_id: id});

        if(!user) {
            req.flash('error', 'Something went wrong');
            return res.redirect('/users/signIn');
        }

        // we have a valid user with this id
        const secret = process.env.JWT_SECRET + user.password;

        // validate JWT
        const payload = jwt.verify(token, secret);

        if(!payload) {
            req.flash('error', 'Something went wrong');
            return res.redirect('/users/signIn');
        }

        // send response
        res.render('resetForgotPassword', {email: user.email});
        
    } catch(err) {
        console.log(err)
        req.flash('error', 'Something Went Wrong!');
        res.redirect('/users');
    }
}

// POST - /resetForgotPassword/:id/:token
// public route
// validates the reset URL and user
// updates the user password
module.exports.postresetForgotPassword = async(req, res) => {
       try{
        //get fields from the req params
        const {id, token} = req.params;
        const {newPassword, newConfirmPassword} = req.body

        //validate the fields
        if(/\s/.test(newPassword)) {
            req.flash('error', 'password doesnt contain spaces');
            return res.redirect('back');
        }
        
        if(newPassword !== newConfirmPassword) {
            req.flash('error', 'passwords didnt matched');
            return res.redirect('back');
        }

        //verify the id
        const validUser = await USER.findOne({_id: id});

        if(!validUser) {
            req.flash('error', 'Invalid User');
            return res.redirect('/users/signIn');
        }

        // we have a valid user with this id
        const secret = process.env.JWT_SECRET + validUser.password;
        // validate JWT
        const payload = jwt.verify(token, secret);

        // Hashing passwords
        const hashPassword = await bcrypt.hash(newPassword, 12);
    
        //find user and update
        const user = await USER.findOneAndUpdate({_id: payload.id, email: payload.email}, {
            password: hashPassword
        }, {new: true});
    
        if(!user) {
            req.flash('error', 'something went wrong');
            return res.redirect('/users/signIn');
        }
        
        // send response
        req.flash('success', 'password updated successfully');
        return res.redirect('/users/signIn');
        
    } catch(err) {
        console.log(err);
        req.flash('error', 'Something Went Wrong!');
        res.redirect('/users');
    }
}
