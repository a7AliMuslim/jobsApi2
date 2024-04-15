require('dotenv').config();
require('express-async-errors');

// extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

const express = require('express');
const app = express();
const authRouter=require('./routes/auth.js');
const jobsRouter=require('./routes/jobs.js');
const authenticateUsers=require('./middleware/authentication.js');


// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// extra packages
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());


// routes
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/jobs',authenticateUsers,jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
//app.use((err, req, res, next)=>{
//    res.status(500).json({...err});
//    
//})

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await require('./db/connect.js');
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
