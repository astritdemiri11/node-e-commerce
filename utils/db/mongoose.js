const mongodb = require('mongodb');

const { MongoClient } = mongodb;

let db = mongodb.Db;

const connectionLink = 'mongodb+srv://e-commerce-app:112123321@cluster0.ydpec.mongodb.net/e-commerce?retryWrites=true&w=majority';

const mongoConnect = (callback) => {
  if (!db) {
    return MongoClient.connect(connectionLink).then((client) => {
      db = client.db();

      callback(db);
    }).catch((error) => {
      throw error;
    });
  }

  return callback(db);
};

// const getDb = () => {
//   if (!db) {
//     throw new Error('No DB found!');
//   }

//   return db;
// };

module.exports = mongoConnect;
