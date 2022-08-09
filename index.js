// app setup 

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')
const app = express()
const port = process.env.HOST || 80
require('dotenv').config()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// internal imports
const { errorHandler, notFoundHandler } = require('./middlewares/common/errorHandler')
const loginRouter = require("./router/loginRoute");
const usersRouter = require("./router/userRoute");
const inboxRouter = require("./router/inboxRoute");
// connect database


const uri = `mongodb+srv://${process.env.MONGO_ADMIN}:${process.env.MONGO_PASS}@cluster0.ha0ln.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).catch(err => console.log(err))
// const chatCollection = client.db("chat").collection("message");
// const userCollection = client.db("chat").collection("user");

// setting ejs engine

app.set("view engine", "ejs")

// setting static/public
app.use(express.static(path.join(__dirname, "public")))

app.use(cookieParser(process.env.COOKIE_SECRET))


// routing setup
app.use("/", loginRouter);
app.use("/users", usersRouter);
app.use("/inbox", inboxRouter);

// 404 not found
app.use(notFoundHandler)

// error handiling
app.use(errorHandler)


// listening to server
app.listen(port)