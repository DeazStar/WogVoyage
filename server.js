const dotenv = require('dotenv');

dotenv.config({path: 'config.env'});

const mongoose = require('mongoose');
const app = require('./app');

mongoose.connect(process.env.DATABASE_URL).then((data) => {
  console.log('Database connected')
}).catch((err) => {
  console.log('Database Error');
  process.exit();
});

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port} ...`);
});

module.exports = server;