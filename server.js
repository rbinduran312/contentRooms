const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

app.use(function (err, req, res, next) {
  console.log("the errror is : ", err)
  if (err.isBoom) {
      res.status(err.output.statusCode).json(err.output.payload);
  }
  else if (err.status === 401) {
      res.status(401).json({ result: 0, message: 'Invalid Token Expire' });
  } else if (err.status === 403) {
      res.status(403).json({ result: 0, message: 'Forbidden request' });
  } else if (err.status === 404) {
      res.status(404).json({ result: 0, message: 'Entity not found' });
  } else {
      res.status(400).json({ result: 0, message: err.Error || 'Bad request' });
  }
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
