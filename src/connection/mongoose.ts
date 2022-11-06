import mongoose from 'mongoose';

export const connectionLink = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.ihyidt0.mongodb.net/${process.env.MONGO_DATABASE}?w=majority`;

export const connect = (callback: any) => {
  mongoose.connect(`${connectionLink}&retryWrites=true`).then(() => {
    // User.findOne().then((user) => {
    //   if (!user) {
    //     const newUser = new User({
    //       name: 'Astrit Demiri',
    //       email: 'contact@astritdemiri.com',
    //       cart: {
    //         items: []
    //       }
    //     });

    //     newUser.save();
    //   }
    // });

    callback();
  }).catch((error) => {
    console.log(error);
  });
};
