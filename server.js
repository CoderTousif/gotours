require('dotenv').config();

// process.on('uncaughtException', (err) => {
//     console.error('Uncaught Exception');
//     console.error(err);
//     console.error('Shutting Down the server...');
//     // kill
//     process.exit(1);
// });

const app = require('./app');
const db = require('./db');

console.log('Current Env:', app.get('env'));
// console.log(process.env);

db.connect();

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
    console.log(`Server running on port ${port} ....`);
});

process.on('unhandledRejection', (err) => {
    console.log('Unhandled Rejection');
    console.error(err);
    console.log('Shutting Down the server...');
    // safely close
    db.close();
    server.close(() => {
        // kill
        process.exit(1);
    });
});

process.on('SIGTERM', (err) => {
    console.log('Sigterm Received');
    db.close();
    server.close(() => {
        console.log('Process terminated');
    });
});

process.on('SIGINT', function () {
    console.log('SIGINT Received');
    db.close();
    server.close(() => {
        console.log('Process terminated');
    });
});
