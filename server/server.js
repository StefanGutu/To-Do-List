require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 5000;

app.use(bodyParser.json()); //send the body of incoming requests
app.use(cors()); //enable express server to respond to requests


// PostgreSQL connection with database
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});


//Get all tasks
app.get('/api/tasks', async (req, res) => { // get request
  try { //handle errors if they occur
    const result = await pool.query('SELECT * FROM tasks'); //select all rows from the data base
    res.json(result.rows); // contain the results of query
  } catch (err) {   // Send error if there is one
    console.error(err);
    res.status(500).send('Server error');
  }
});


//Update the sorted tasks
app.post('/api/tasks/sorted', async (req, res) => {
  const sortedTasks = req.body;
  try {
    // Delete all existing tasks
    await pool.query('DELETE FROM tasks');
    
    // Insert sorted tasks
    for (const task of sortedTasks) {
      await pool.query(
        'INSERT INTO tasks (name, state) VALUES ($1, $2)',
        [task.name, task.state]
      );
    }
    res.status(201).send('Tasks updated successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});



app.listen(port, () => {
  console.log(`Server is running on http://localhost:5000`); // listen the the frontend page
});
