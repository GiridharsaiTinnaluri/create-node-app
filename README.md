# create-node-app

This is a Node.js authentication starter code for creating any new application developed by using MongoDB, Node, Express and EJS with features like authentication, authorization using Passport.js, reset password, forgot password by sending mail, Google authentication, express-sessions, flash-messages and scalable folder structure. 🚀

## Features

- User registration and login with email and password
- User authentication and authorization with Passport.js
- Password hashing with bcryptjs
- Password reset and forgot password functionality with nodemailer
- Google authentication with Passport Google OAuth 2.0 strategy
- Express sessions to store user data in cookies
- Flash/Noty messages to display success and error messages
- Scalable folder structure with MVC pattern
- EJS templates for rendering dynamic views
- Tailwing for styling and layout

# instructions 
To use this starter code, you need to follow these steps:

1. Clone this repository to your local machine: `git clone https://github.com/your-username/nodejs-authentication-starter-code.git`
2. Install the dependencies: `npm install`
3. Create a `.env` file and add your environment variables such as database URL, email credentials, Google client ID and secret, etc.
4. Run the server: `npm start` or `npm run dev` for development mode
5. Open your browser and go to `http://localhost:3000` or your custom port

# Environmental variables
The code is easy to use and customize. To run the code, you need to have node and mongodb installed on your machine. You also need to create a .env file in the root directory and add your own values for the following variables:

- PORT: The port number for the server
- MONGO_URI: The connection string for mongodb
- SESSION_SECRET: The secret key for express-session
- MAIL_USER: The email address for sending mails
- MAIL_PASS: The password for the email address
- GOOGLE_CLIENT_ID: The client id for google oauth
- GOOGLE_CLIENT_SECRET: The client secret for google oauth
- GOOGLE_CALLBACK_URL: The callback url for google oauth

To run the project, you need to execute the following commands in the terminal:

# Install dependencies
npm install

# Start the server
npm start
```

The server will run on http://localhost:5000 by default. You can then access the following routes:

- /users: The home page
- /users/signUp: The registration page
- /users/signIn: The login page
- /users/profile: The dashboard page (protected)
- /users/signOut: The logout route (protected)
- /users/auth/google: The Google authentication route
- /users/auth/google/callback: The Google authentication callback route
- /users/forgotPassword: The forgot password page
- /users/forgotPassword/:id/:token: The reset password page

You can modify or extend this starter code according to your needs and preferences. Happy coding!
```

Enjoy building your awesome application with Node.js authentication! 😎


