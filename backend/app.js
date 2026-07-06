const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const app = express();

// Trust proxy for secure cookies/headers behind Vercel load balancer/proxy
app.enable('trust proxy');

// Check Cloudinary config on startup in production
if (process.env.NODE_ENV === 'production') {
  const hasCloudinary = process.env.CLOUDINARY_API_KEY && 
                        process.env.CLOUDINARY_API_KEY !== 'your_api_key' && 
                        process.env.CLOUDINARY_API_KEY !== '';
  if (!hasCloudinary) {
    console.warn('\x1b[33m%s\x1b[0m', 'WARNING: Cloudinary credentials are not configured. Local image uploads will NOT persist on serverless platforms like Vercel!');
  }
}

// Security and utility middlewares
app.use(helmet());
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const os = require('os');
const uploadDir = process.env.NODE_ENV === 'production' 
  ? path.join(os.tmpdir(), 'uploads')
  : path.join(__dirname, 'uploads');

app.use('/uploads', express.static(uploadDir));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Basic Route for testing
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Veloura API is running smoothly' });
});

app.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Veloura API Backend is online. Use /api/v1 endpoints.' });
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/banners', bannerRoutes);
app.use('/api/v1/uploads', uploadRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/orders', orderRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

module.exports = app;
