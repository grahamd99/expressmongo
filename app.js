const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const PORT = 3000;

const app = express();

app.use(express.static('public'));

// Configure Nunjucks templating engine
nunjucks.configure(__dirname + '/views', {
  autoescape: true,
  express: app,
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true })); // Parse form data

// MongoDB connection
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/myDatabase');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a schema and model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
  res.render('index.njk', { title: 'Hello World Yeah!' });
})

// Handle form submission
app.post('/submit', (req, res) => {
  const userData = new User({
    name: req.body.name,
    email: req.body.email,
  });

  userData
    .save()
    .then(() => {
      res.render('success.njk', { name: req.body.name });
    })
    .catch((err) => {
      res.status(500).render('error.njk', { error: err });
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
