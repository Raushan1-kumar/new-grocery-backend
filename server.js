require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const productRoutes = require('./routes/product');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoute');
const shopRoutes = require('./routes/shop');
const app = express();

// Middleware
const origin =
  process.env.NODE_ENV === 'production'
    ? 'http://localhost:5173'
    : 'http://localhost:5173';

app.use(cors());

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true
  }
});

// Make io available in controllers
app.set('io', io);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/offers', require('./routes/offerRoutes'));

app.get('/for-cons', (req, res) => {
  res.status(200).send('For consumers');
});

// Optional: Socket.IO connection event (for debugging)
io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start server with Socket.IO
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));