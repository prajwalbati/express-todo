let mongoose = require('mongoose');

let dbConnection = async () => {
    try {
        mongoose.Promise = global.Promise;
        mongoose.set('returnOriginal', false);
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGO_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: false });
        console.log("Database connected successfully");
    } catch (err) {
        console.error("***** Error while connecting database: "+err.message+" *****");
    }
};

dbConnection();