const express = require('express');
const app = express();
const PORT = 4000;
const cors = require('cors')
const path = require('path')
const mongoose = require('mongoose')
const {MONGODB_URL} = require('./config')

global.__basedir = __dirname;
mongoose.connect(MONGODB_URL);

mongoose.connection.on("connected", () => {
    console.log("DB Connected")
});

mongoose.connection.on("error", (error) => {
    console.log("DB not connected")
});

app.use('/uploads', express.static(path.join(__dirname, '/uploads')))
app.use(cors());
app.use(express.json());

require('./models/product')
require('./models/user')
app.use(require('./routes/file_route'));
app.use(require('./routes/product_route'));
app.use(require('./routes/user_route'));

app.listen(PORT, () => {
    console.log("Server Started")
});