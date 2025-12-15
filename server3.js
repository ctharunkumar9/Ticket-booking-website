const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse the form data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// MySQL Database Connection
const db = mysql.createConnection({
  host: 'localhost', // replace with your host
  user: 'root', // replace with your MySQL username
  password: '', // replace with your MySQL password
  database: 'user_management' // database name
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Database connection error: ' + err.stack);
    return;
  }
  console.log('Connected to the database');
});

// Serve the static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Route to handle ticket booking submission
app.post('/book-ticket', (req, res) => {
  const { name, email, from, destination, date, distance, ageGroup, ticketType, cost } = req.body;

  const query = `
    INSERT INTO busbookings (name, email, from_location, destination, travel_date, distance, age_group, ticket_type, cost)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.query(query, [name, email, from, destination, date, distance, ageGroup, ticketType, cost], (err, result) => {
    if (err) {
      console.error('Error inserting booking: ' + err.stack);
      res.status(500).send('Error booking the ticket');
    } else {
      res.status(200).send('Ticket booked successfully');
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
