import mongoose from 'mongoose';

export const connectionLink = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.ihyidt0.mongodb.net/${process.env.MONGO_DATABASE}?w=majority`;

export const connect = (callback: any) => {
  mongoose.connect(`${connectionLink}&retryWrites=true`).then(() => {
    callback();
  }).catch((error) => {
    console.log(error);
  });
};
