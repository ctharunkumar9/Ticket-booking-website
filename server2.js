const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create a MySQL connection pool
const db = mysql.createPool({
  host: 'localhost',    // Replace with your database host
  user: 'root',         // Replace with your database username
  password: '',         // Replace with your database password
  database: 'user_management', // Replace with your database name
});

// Endpoint to check login credentials
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length > 0) {
      res.status(200).json({ message: 'Login successful!' });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  });
});

// Serve static files (your HTML, CSS, JS)
app.use(express.static('public'));

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
