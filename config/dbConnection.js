const mongoose = require('mongoose');

// connects to the mongodb server
const connection = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Mongo is connected: ${conn.connection.host}`);
    } catch(error) {
        console.log(error);
        process.exit(1);
    }
}

// exporting the db connection
module.exports = connection;