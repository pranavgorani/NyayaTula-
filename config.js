import dotenv from 'dotenv';
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || 'nyayatula_legal_metrology_jwt_secret_2026';
export const PORT = process.env.PORT || 5000;
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nyayatula';

export default {
  JWT_SECRET,
  PORT,
  MONGODB_URI
};
