require('dotenv').config();
// psql -U postgres -h localhost -W
// command to connect postgresql server using psql
const { sequelize } = require('./models');
const express = require('express');
const { json, urlencoded } = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const { errorHandler } = require('./middlewares/errorMiddlewares');

const PORT = process.env.PORT || 5000;

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(cors({ origin: true, credentials: true }));

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/posts', require('./routes/postRoutes'));
app.use('/api/v1/comments', require('./routes/commentRoutes'));

// app.use(errorHandler);

app.listen(PORT, async (error) => {
  if (error) {
    console.error('Something went wrong: ', error);
    process.exit(1);
  } else {
    console.log(`Server running at http://localhost:${PORT}`);
    try {
      await sequelize.authenticate();
      console.log('Successfully connected to the database!');
      // call the sequelize.sync method will cause erase everything from database so ist better to use sequelize.authenticate method
      // sequelize.sync({ force: true, match: /sequelize$/ });
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      process.exit(1);
    }
  }
});

// const process = require("process");

// module.exports = {
//   development: {
//     username: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     host: process.env.DB_HOST,
//     dialect: "postgres",
//   },
//   test: {
//     username: "root",
//     password: null,
//     database: "database_test",
//     host: "127.0.0.1",
//     dialect: "postgres",
//   },
//   production: {
//     username: "root",
//     password: null,
//     database: "database_production",
//     host: "127.0.0.1",
//     dialect: "postgres",
//   },
// };
