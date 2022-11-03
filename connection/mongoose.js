const mongoose = require('mongoose');
const User = require('../models/mongoose/user');

const connectionLink = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.ihyidt0.mongodb.net/${process.env.MONGO_DATABASE}?w=majority`;

const connect = (callback) => {
  mongoose.connect(`${connectionLink}&retryWrites=true`).then(() => {
    User.findOne().then((user) => {
      if (!user) {
        const newUser = new User({
          name: 'Astrit Demiri',
          email: 'contact@astritdemiri.com',
          cart: {
            items: [],
          },
        });

        newUser.save();
      }
    });

    callback();
  }).catch((error) => {
    console.log(error);
  });
};

module.exports = { connect, connectionLink };
