const express = require('express');
const { v4: uuidv4 } = require('uuid'); // importing uuid library
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// **************************************************************
// Put your implementation here
// If necessary to add imports, please do so in the section above

app.get('/', (req, res) => {
    res.send('My api project :)');
});

// in memory "array" (really its a map)
const users = new Map();

// POST request to create new user
app.post('/users', (req, res) => {
  const {name, email} = req.body;
  // check if valid name or email
  if (!name || !email) {
    return res.status(400).json({error: 'Did not supply a valid name and/or email'});
  }

  // use uuid to make a unique id and create a new user with it
  const id = uuidv4();
  const user = {id, name, email};

  // save into our storage
  users.set(id, user);
  // Return 201 status code with new user data
  res.status(201).json(user);
});

// Get request for user data
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  // Verify that user exists first using the uuid
  const user = users.get(id);
  // throw error if not found
  if (!user) {
    return res.status(404).json({error: 'A user with given uuid was not found'});
  }

  // on success, return 200 and the user data
  res.status(200).json(user);
});

// PUT request to make an update to user
app.put('/users/:id', (req, res) => {
  const {id} = req.params;
  const {name, email} = req.body;
  // Verify that user exists
  if (!users.has(id)) {
    return res.status(404).json({error: 'User with given uuid not found'});
  }

  // Verify proper name and email given
  if (!name || !email) {
    return res.status(400).json({error: 'No name and or email given'});
  }

  // if user exists and we have a valid query, then update it
  const updatedData = {id, name, email};
  users.set(id, updatedData);

  // Return 200 status code with updated user data
  res.status(200).json(updatedData);
});

// DELETE request to remove user data
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  // Check if user exists
  if (!users.has(id)) {
    return res.status(404).json({error: 'User with given uuid not found'});
  }

  // Delete given user
  users.delete(id);
  // simply return 204 status code
  res.status(204).send();
});

// Do not touch the code below this comment
// **************************************************************

// Start the server (only if not in test mode)
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

module.exports = app; // Export the app for testing
