import 'dotenv/config';

export const MONGO_URI = process.env.MONGO_URI;
export const JWT_SECRET = process.env.ACCESS_TOKEN_KEY;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_KEY;
