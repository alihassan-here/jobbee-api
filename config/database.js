const mongoose = require('mongoose');


const connectDatabase = () => {
    mongoose.connect(process.env.LOCAL_MONGO_URI).then(con => {
        console.log(`MongoDB Database connected with host: ${con.connection.host}`.green.bold);
    });
}

module.exports = connectDatabase;