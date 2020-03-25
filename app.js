// express app
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const errorCtrl = require('./controllers/errorController');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
// Global Middlewares
// serve static files
app.use(express.static(path.join(__dirname, 'public')));

// set security http headers
app.use(helmet());

// express body parser. reads data from body into req.body
app.use(express.json({ limit: '10kb' }));

// express body parser. reads form data encoded in the url
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// cookie parser. reads data from cookie into req.cookies
app.use(cookieParser());

// data sanitization against NoSQL query injection
app.use(mongoSanitize());

// data sanitization against XSS
app.use(xss());

// http parameter pollution
app.use(
    hpp({
        whitelist: [
            'duration',
            'maxGroupSize',
            'ratingsAverage',
            'difficulty',
            'price'
        ]
    })
);
// log request info
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// limit request --- DDoS protection
const limiter = rateLimit({
    // 100 request/hour for each ip
    max: 200,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request from this IP address'
});
app.use('/api', limiter);

// custom middleware
// app.use((req, res, next) => {
// req.requestedAt = new Date().toUTCString();
// console.log('Cookie:', req.cookies);
// next(); // calling next middleware
// });

// router mounting
// entry point to the API
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// entry point to the front-end
app.use('/', viewRouter);

// fallback route
app.all('*', (req, res, next) => {
    // const err = new Error(`${req.url} does not exist`);
    // err.statusCode = 404;
    // err.status = 'fail';
    res.status(404).json({
        status: 'fail',
        message: `${req.url} does not exist`
    });
});

// global error handling middleware
app.use(errorCtrl);

module.exports = app;