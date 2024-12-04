const express = require("express")
const rateLimit = require("express-rate-limit")
const xss = require('xss-clean')
const helmet = require("helmet")
const hpp = require('hpp');
const cors = require("cors")
const mongoSanitize = require('express-mongo-sanitize');
var cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
const path = require("path");
require('dotenv').config()


const app = new express();


// Using rate limit middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
})

app.use(limiter)

// Using helmet for secure http response

app.use(helmet())

// Using xss-clean sanitize for body query params

app.use(xss())

// Using hpp for protect against HTTP Parameter Pollution attacks query req.body params

app.use(hpp())

// Using cors for enabling CORS

app.use(cors({
    origin : "",
    credentials:true
}))

// Using MongoSanitize for sanitize user input

app.use(mongoSanitize())


// Using cookie parser for set cookie

app.use(cookieParser())

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.set('trust proxy', 'loopback'); // Only trust localhost proxy
// app.set('trust proxy', '192.168.0.1'); // Trust specific IP
// app.set('trust proxy', 1); // Trust the first proxy
// Database Connect 

app.get("/", (req, res) => {
    res.send("server run successfully");
});


const dbPort = process.env.DB_URL

mongoose.connect(dbPort).then((res) => {
    console.log(`--Database connect--`)
}).catch((error) => {
    console.log(`--Database connection failed-- ${error}`)
});

const router = require("./src/routes/api");

app.use("/api/v1", router );


app.get("/", (req, res) => {
    res.send("Server is running");
});






module.exports = app

