const { error } = require('console');
const express = require('express');
const path = require('path');
const app = express();
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser")
const mongoose = require("mongoose");
const User = require("./models/User")
const jwt = require('jsonwebtoken');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const db = "mongodb://127.0.0.1:27017/FlowLearn"
const port = process.env.PORT || 3000;

// mongoose connection
mongoose.connect(db)
    .then(() => {
        console.log('mongo Connection is successful');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });


// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Explicitly define paths for static files
// This ensures CSS, JS, and images are properly served
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/img', express.static(path.join(__dirname, 'public/img')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: false
}));

app.use(flash());



// Add this middleware to make flash messages available in all views
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Authentication middleware
const generateToken = (user) => {
    return jwt.sign({ id: user._id }, 'your-secret-key', { expiresIn: '1h' });
};

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.redirect('/auth');

    jwt.verify(token, 'your-secret-key', (err, decoded) => {
        if (err) return res.redirect('/auth');
        req.user = decoded;
        next();
    });
};

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
app.get("/auth", (req, res) => {
    res.render("authPage")
});

app.get('/dashboard', verifyToken, (req, res) => {
    res.render("dashboard")
})


app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash('error', 'Email already registered');
            return res.redirect('/auth');
        }

        console.log(username, email, password)
        const user = new User({
            username: username,
            email: email,
            password: password // Schema will auto-hash
        });
        console.log(user)
        // Save the user to the database
        await user.save();

        // Generate JWT token
        const token = generateToken(user);

        req.flash('success', 'Registration successful!');
        // Set the token as a cookie and redirect
        res.cookie('token', token, { httpOnly: true }).redirect('/dashboard');
    } catch (err) {
        req.flash('error', 'Registration failed. Please try again.');
        res.redirect('/auth?error=Registration failed');
        console.log(err)
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            req.flash('error', 'Invalid username or Invalid password');
            return res.redirect('/auth?error=Invalid username or Invalid password');
        }

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) {
            req.flash('error', 'Invalid username or Invalid password');
            return res.redirect('/auth?error=Invalid username or Invalid password');
        }

        const token = generateToken(user);
        req.flash('success', 'Login successful!');
        res.cookie('token', token, { httpOnly: true }).redirect('/dashboard');
    } catch (err) {
        res.redirect('/auth?error=auth failed');
        console.log(err);
    }
});



app.get('/logout', (req, res) => {
    req.flash('error', 'You have been logged out');
    res.clearCookie('token').redirect('/auth');
});

// Simple 404 handler that doesn't depend on a view
app.use((req, res) => {
    res.status(404).send('<h1>404 - Page Not Found</h1><p>The page you requested does not exist.</p><a href="/">Go Home</a>');
});

// Start the server
app.listen(port, () => {
    console.log(`Study Planner app listening at http://localhost:${port}`);
});
