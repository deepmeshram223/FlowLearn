const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Debug statement to show the project root directory
console.log('Project root directory:', __dirname);

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Explicitly define paths for static files
// This ensures CSS, JS, and images are properly served
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/img', express.static(path.join(__dirname, 'public/img')));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

// Additional routes
app.get('/about', (req, res) => {
    res.send('About page - Coming soon');
});

app.get('/features', (req, res) => {
    res.send('Features page - Coming soon');
});

app.get('/pricing', (req, res) => {
    res.send('Pricing page - Coming soon');
});

// Simple 404 handler that doesn't depend on a view
app.use((req, res) => {
    res.status(404).send('<h1>404 - Page Not Found</h1><p>The page you requested does not exist.</p><a href="/">Go Home</a>');
});

// Start the server
app.listen(port, () => {
    console.log(`Study Planner app listening at http://localhost:${port}`);
});

