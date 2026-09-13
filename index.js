import mongoose from 'mongoose';
import jsonStore from './jsonStore.js';

let isMongoConnected = false;

export const initDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/nyayatula';
  try {
    // Attempt fast connection with 1.5s timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 1500,
      connectTimeoutMS: 1500,
    });
    isMongoConnected = true;
    console.log('✅ Connected to MongoDB at:', uri);
  } catch (err) {
    isMongoConnected = false;
    console.log('ℹ️ MongoDB not detected. Running in persistent embedded datastore mode (NyayaTula JSON Storage).');
  }
};

export const isDbConnected = () => {
  return isMongoConnected && mongoose.connection.readyState === 1;
};

export { jsonStore };
export default { initDB, isDbConnected, jsonStore };
