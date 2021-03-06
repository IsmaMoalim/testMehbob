const express = require('express');
require('dotenv').config(); // dotenv package import
const logger = require('./config/logger');
const routeCatalog = require('./routes/v1/index');
const { morganMiddleware } = require('./middlewares'); // require morgan middleware
const { ApiError } = require('./payload/ApiError');
const httpStatus = require('http-status');
const cors = require('cors');
const helmet = require('helmet');  // determine the header in express
  // cross origin resourse sharing

const app = express();
const BaseURL = process.env.BaseURL;
const port = process.env.port;


/**
 * Middlewares
 */

app.use(express.json());
app.use(morganMiddleware); // use morgan middlleware in a seperate file
app.use(cors());    // enabling CORS for all request
app.use(helmet());  // adding Helmet to enhance your API's Security
  


/**
 * Router Middleware
 */



app.use('/v1', routeCatalog);




// All Unknown API Error Handling
app.use((req, res , next) => {
  let status = httpStatus.NOT_FOUND;
  let error ='Api Not Found';
  
res.status(401).send(new ApiError(status, error));
});

// All The Exceptions Error Handling (Custom Error Middleware)
app.use((err, req, res, next) => {
  res.status(err.status).send(err);
  next();
})


app.listen(port, () =>{
  logger.info(`app is listening on port ${BaseURL}:${port}`);
}); 

