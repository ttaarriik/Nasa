const mongoose = require('mongoose');

require('dotenv').config();
 
const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once('open', () => {
    console.log('mongodb connection successful');
})

mongoose.connection.on('error', (err) => {
    console.log('mongodb connection error', err);
})

const mongoConnect = async () => {
   await mongoose.connect(MONGO_URL);
}

const mongoDisconnect = async () => {
    await mongoose.disconnect();
}

module.exports = {
    mongoConnect,
    mongoDisconnect
}