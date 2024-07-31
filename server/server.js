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
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '331331',
  port: 5432, 
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



//Create a new task
app.post('/api/tasks', async (req, res) => { // post request
  const { name, state } = req.body; // new data
  try {
    const result = await pool.query( // send new data to the database
      'INSERT INTO tasks (name, state) VALUES ($1, $2) RETURNING *', // RETURNING * - return the new row back
      [name, state]
    );
    res.status(201).json(result.rows[0]); // contain the new row that is on index 0
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});



// Endpoint to update a task
app.put('/api/tasks/:id', async (req, res) => { // put request
  const { id } = req.params;  // id from url
  const { name, state } = req.body; //data from the req
  try {
    const result = await pool.query( //update the state of the task
      'UPDATE tasks SET name = $1, state = $2 WHERE id = $3 RETURNING *',
      [name, state, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});



// Endpoint to delete a task
app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params; // gets the id from the url
  try {
    const result = await pool.query( // delete the specified element
      'DELETE FROM tasks WHERE id = $1 RETURNING *',
      [id]
    );
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:5000`); // listen the the frontend page
});
