const cron = require('node-cron');

// Example task: This will run every minute
cron.schedule('* * * * *', () => {
    console.log('Running a task every minute');
    // Place your logic here, e.g., updating activity states, sending emails, etc.
    console.log('lalalal');
});

// Another example task: This will run every day at midnight
cron.schedule('0 0 * * *', () => {
    console.log('Running a task every day at midnight');
    // Place your daily logic here
});