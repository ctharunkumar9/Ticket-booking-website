const express = require('express');
const mysql = require('mysql2'); // Using mysql2 for connection pooling
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse JSON and URL-encoded requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up static file serving from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Create a MySQL connection pool (using mysql2 for better performance with pooling)
const db = mysql.createPool({
  host: 'localhost',    // Replace with your database host
  user: 'root',         // Replace with your database username
  password: '',         // Replace with your database password
  database: 'user_management', // Replace with your database name
});

// Routes for user registration and login

// Route for user registration
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  // Basic validation to check if all fields are provided
  if (!name || !email || !password) {
    return res.status(400).send('All fields are required.');
  }

  // Check if the email already exists in the database
  const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      console.error('Error checking email:', err);
      return res.status(500).send('An error occurred while checking email.');
    }
    if (results.length > 0) {
      return res.status(400).send('Email is already taken.');
    }

    // Proceed with inserting new user data
    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(query, [name, email, password], (err, result) => {
      if (err) {
        console.error('Error inserting data:', err);
        return res.status(500).send('Registration failed.');
      }
      // Successfully registered
      res.send('User registered successfully! Please log in.');
    });
  });
});

// Route for user login
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

// Route to handle ticket booking
app.post('/book-ticket', (req, res) => {
  const { name, email, from, destination, date, distance, ageGroup, ticketType, cost } = req.body;

  // Validate the booking data
  if (!name || !email || !from || !destination || !date || !distance || !ageGroup || !ticketType || !cost) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  // Prepare query to insert booking data into busbookings table
  const query = `INSERT INTO busbookings (name, email, from_location, destination, date, distance, age_group, ticket_type, cost)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  // Insert the data into the busbookings table
  db.query(query, [name, email, from, destination, date, distance, ageGroup, ticketType, cost], (err, result) => {
    if (err) {
      console.error('Error inserting booking data:', err);
      return res.status(500).json({ message: 'Error booking the ticket, please try again later' });
    }

    // Successfully booked the ticket
    res.status(200).json({ message: 'Ticket booked successfully!' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
