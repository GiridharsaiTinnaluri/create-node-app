// importing third party libraries
require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passportLocalStrategy');
const passportGoogle = require('./config/passportGoogleOauth');
const MongoStore = require('connect-mongo'); 
const flash = require('connect-flash');

//importing all required modules
const MDBConnection = require('./config/dbConnection');
const userRoutes = require('./routes/users');
const customMW = require('./config/middleware');

const app = express();
const PORT = 5000;

// parsing request body
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

// Giving access to the public assets folder
app.use(express.static('./assests'));
app.use(expressLayouts);
//extract styles and scripts from sub pages
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


// setting view templates - ejs.
app.set('view engine', 'ejs');
app.set('views', './views');

//mongo store is used to store the session cookie in the db
app.use(session({
    name: 'userId',
    //change the secet to envi
    secret: 'blahblah',
    saveUninitialized: false,
    resave: false,
    cookie:{
        maxAge: (1000 * 60 * 100)
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        autoRemove: 'disabled'
    },(err) => {
        console.log(err || 'connect-mongodb setup done')
    })
}));

// Authenticating using passport library
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

// flash midleware used to set flash messages to cookies 
app.use(flash());
app.use(customMW.setFlash); // used to pass req msg to responses

//configuring Routes
app.use('/users', userRoutes);

// mongo db connection and Listening to the server.
MDBConnection().then(() => {
    app.listen(PORT, (err) => {
        if(err) {
            console.log(err);
        }
    
        console.log('Running Server On PORT : ', PORT);
    })
}).catch((err) => {
    console.log(err);
    process.exit(1);
})
