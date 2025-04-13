// Get the client
const mysql = require('mysql2');
require('dotenv').config();

// Create the connection to the database

const pool = mysql.createPool({
    host: process.env.SQL_HOSTNAME,
    user: process.env.SQL_USERNAME,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DBNAME,
});

// Set up the API

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;

// Make it available for public access

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    next();
});

app.use(cors());
app.options("*", cors());

app.set('json spaces', 2)
app.use(bodyParser.json({
    limit: "50mb"
}))
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

// Listen to outside connection

app.listen(port, () => {
    console.log(`App running on port ${port}. Control+C to exit.`)
})


// Info
app.get('/', (_req, res) => {
    res.json({ info: 'Consultancy business API backend with Swagger docs' });
});


/** CLIENT ROUTES */
app.get('/v1/clients/list', (_req, res) => {
    pool.query('SELECT * FROM clients', [], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ status: 'success', data: results });
    });
});

app.get('/v1/clients/get', (req, res) => {
    const id = req.query.id;
    pool.query('SELECT * FROM clients WHERE client_id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ status: 'success', data: results });
    });
});

app.post('/v1/clients/create', (req, res) => {
    const { first_name, last_name, email, phone_number, address } = req.body;
    pool.query(
        'INSERT INTO clients (first_name, last_name, email, phone_number, address) VALUES (?, ?, ?, ?, ?)',
        [first_name, last_name, email, phone_number, address],
        (err) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ status: 'success', message: 'Client created' });
        }
    );
});

/** CONSULTANT ROUTES */
app.get('/v1/consultants/list', (_req, res) => {
    pool.query('SELECT * FROM consultants', [], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ status: 'success', data: results });
    });
});

app.get('/v1/consultants/get', (req, res) => {
    const id = req.query.id;
    pool.query('SELECT * FROM consultants WHERE consultant_id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ status: 'success', data: results });
    });
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Database connected successfully');
        connection.release();
    }
});
/** CONSULTATION SESSION ROUTES */
app.get('/v1/sessions/list', (_req, res) => {
    pool.query('SELECT * FROM consultation_sessions', [], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ status: 'success', data: results });
    });
});

app.get('/v1/sessions/get', (req, res) => {
    const id = req.query.id;
    pool.query('SELECT * FROM consultation_sessions WHERE client_id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ status: 'success', data: results });
    });
});

app.post('/v1/sessions/create', (req, res) => {
    const { client_id, consultant_id, session_date, session_notes } = req.body;
    pool.query(
        'INSERT INTO consultation_sessions (client_id, consultant_id, session_date, session_notes) VALUES (?, ?, ?, ?)',
        [client_id, consultant_id, session_date, session_notes],
        (err) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ status: 'success', message: 'Consultation session created' });
        }
    );
});

/** REVIEW ROUTES */
app.get('/v1/reviews/list', (_req, res) => {
    pool.query('SELECT * FROM reviews', [], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ status: 'success', data: results });
    });
});

app.post('/v1/reviews/create', (req, res) => {
    const { client_id, consultant_id, rating, comment } = req.body;
    pool.query(
        'INSERT INTO reviews (client_id, consultant_id, rating, comment) VALUES (?, ?, ?, ?)',
        [client_id, consultant_id, rating, comment],
        (err) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ status: 'success', message: 'Review submitted' });
        }
    );
});