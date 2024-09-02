// EXTERNAL IMPORTS
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');


// INTERNAL IMPORTS
const { notFoundHandler, errorHandler } = require('./middlewares/common/errorHandler');
const loginRouter = require('./routers/loginRouter');
const userRouter = require('./routers/userRouter');
const inboxRouter = require('./routers/inboxRouter');


const app = express();
dotenv.config();

// DATABASE CONNECTION 
mongoose.connect(process.env.MONGO_CONNECTION_STRING)
    .then(() => {
        console.log("Successfully connected to MongoDB");
    })

    .catch(err => {
        console.error("Error connecting to MongoDB:", err);
    });

// REQUEST PARSERS 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SET VIEW ENGINE 
app.set('view engine', 'ejs');

// SET STATIC FOLDER 
app.use(express.static(path.join(__dirname, "public")));

// PARSE COOKIES
app.use(cookieParser(process.env.COOKIE_SECRET));

// ROUTING SETUP
app.use('/', loginRouter)
app.use('/users', userRouter)
app.use('/inbox', inboxRouter)

// 404 NOT FOUND HANDLER
app.use(notFoundHandler)

// COMMON ERROR HANDLER
app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log(`app listening to port ${process.env.PORT}`)
});