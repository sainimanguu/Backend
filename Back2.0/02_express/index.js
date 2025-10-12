import express from 'express';

const app = express();
const port = 3000;

app.use(express.json());

let teaData = [];
let nextId = 1;

// Create a new tea
app.post('/teas', (req, res) => {
  const { name, price } = req.body;
  if (!name || !price) {
    return res.status(400).send({ error: 'Name and price are required.' });
  }

  const newTea = { id: nextId++, name, price };
  teaData.push(newTea);

  res.status(201).send(newTea);
});

// Get all teas
app.get('/teas', (req, res) => {
  res.status(200).send(teaData);
});

// Get tea by ID
app.get('/teas/:id', (req, res) => {
  const tea = teaData.find(t => t.id === parseInt(req.params.id));
  if (!tea) {
    return res.status(404).send({ message: 'Tea not found.' });
  }
  res.status(200).send(tea);
});

// Update tea by ID
app.put('/teas/:id', (req, res) => {
  const tea = teaData.find(t => t.id === parseInt(req.params.id));
  if (!tea) {
    return res.status(404).send({ message: 'Tea not found.' });
  }

  const { name, price } = req.body;
  if (name) tea.name = name;
  if (price) tea.price = price;

  res.status(200).send(tea);
});

// Delete tea by ID
app.delete('/teas/:id', (req, res) => {
  const index = teaData.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).send({ message: 'Tea not found.' });
  }

  teaData.splice(index, 1);
  res.status(204).send(); // 204 No Content (successful deletion)
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server is listening on port ${port}`);
});
