const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const { domainToASCII, domainToUnicode } = require('url'); // Import domainToASCII and domainToUnicode from the url module
const bookRoutes = require('./routes/bookRoutes');
const borrowerRoutes = require('./routes/borrowerRoutes');
const authorRoutes = require('./routes/authorRoutes');
const countRoutes = require('./routes/countRoutes');

const app = express();
app.use(express.json());
const cors = require("cors");

app.use(cors({
  origin: "https://library-management-frontend-sand.vercel.app",
  credentials: true
}));

// app.use(cors({
//   origin: ['http://localhost:3001', 'http://localhost:3000'],
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true
// }));

// Connect to MongoDB
mongoose.connect(`${process.env.MONGODB_URI}`, {
  dbName: 'Library_DB'
});
const db = mongoose.connection;

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

db.on('connected', () => {
  console.log('MongoDB connected successfully');
});

// Example Punycode operations using url module
const unicodeDomain = domainToUnicode('xn--example-9h2c.com');
const asciiDomain = domainToASCII('example.com');

console.log(`Unicode Domain: ${unicodeDomain}`);
console.log(`ASCII Domain: ${asciiDomain}`);

app.use('/api/books', bookRoutes);
app.use('/api/borrowers', borrowerRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/counts', countRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
