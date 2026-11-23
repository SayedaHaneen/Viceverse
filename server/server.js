const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config/config');
const db = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const creatorRoutes = require('./routes/creatorRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middlewares
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Static built client files (if built)
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
if (require('fs').existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/creators', creatorRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    app: 'VICEVERSE API',
    version: '1.0.0',
    mode: db.isSqlite() ? 'Embedded Relational (SQLite)' : 'MySQL Database',
    timestamp: new Date().toISOString()
  });
});

// 404 Handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `API route '${req.originalUrl}' not found.` });
});

// Single Page Application fallback for client routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return next();
  }
  const indexPath = path.join(__dirname, '..', 'client', 'dist', 'index.html');
  if (require('fs').existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.status(404).send('Client not built yet. Run npm run build in client directory.');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Server Error]:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// Start Server
async function startServer() {
  try {
    await db.initDatabase();

    app.listen(config.PORT, '0.0.0.0', () => {
      console.log(`====================================================`);
      console.log(` VICEVERSE API Engine running on http://localhost:${config.PORT}`);
      console.log(` Database: ${db.isSqlite() ? 'Embedded Relational Store' : 'MySQL Live Pool'}`);
      console.log(`====================================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
