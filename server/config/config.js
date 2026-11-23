require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  JWT_SECRET: process.env.JWT_SECRET || 'viceverse_neon_cyber_secret_key_2026_gta_vi_aesthetic',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  DB: {
    HOST: process.env.DB_HOST || '127.0.0.1',
    PORT: parseInt(process.env.DB_PORT || '3306', 10),
    USER: process.env.DB_USER || 'root',
    PASSWORD: process.env.DB_PASSWORD || '',
    DATABASE: process.env.DB_NAME || 'viceverse',
  },
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
};
