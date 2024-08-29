const { MongoClient } = require('mongodb');
const { mongoUrl, dbName, collectionName } = require('./config');

const client = new MongoClient(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

const connectToMongoDB = async () => {
    try {
        await client.connect();
        const db = client.db(dbName);
        return db.collection(collectionName);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        return null;
    }
};

const insertIntoMongoDB = async (data) => {
    const collection = await connectToMongoDB();
    if (collection) {
        try {
            await collection.insertMany(data);
            console.log('Data inserted into MongoDB');
        } catch (error) {
            console.error('Error inserting data into MongoDB:', error);
        } finally {
            await client.close();
        }
    }
};

module.exports = {
    insertIntoMongoDB
};
