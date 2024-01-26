const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://vaidi:heymongodb@cluster0.a0iswy6.mongodb.net/";

const connectToMongo = () => {
  mongoose.connect(mongoURI)
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch(error => {
      console.error('Error connecting to MongoDB:', error);
    });
};

module.exports = connectToMongo;
