// 3rd Party Libs.
const mongodbLib = require('mongodb');

const MongoClient = mongodbLib.MongoClient;

let db = mongodbLib.Db;

const connectionLink = 'mongodb+srv://e-commerce-app:112123321@cluster0.ydpec.mongodb.net/e-commerce?retryWrites=true&w=majority';

const mongoConnect = callback => {
    if(!db) {
        return MongoClient.connect(connectionLink).then(client => {
            db = client.db();
            
            callback(db);
        }).catch(error => {
            console.log(error);
            throw error;
        });
    }

    callback(db);
};

const getDb = () => {
    if(!db) {
        throw 'No DB found!';
    }

    
    return db;
}

module.exports = mongoConnect;