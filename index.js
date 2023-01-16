require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { dbConnect } = require('./configs/db');
const userRoute = require('./routes/users.route');
const postRoute = require('./routes/posts.route');
const { authenticate } = require('./middlewares/authentication.middleware');

const PORT = process.env.PORT;
const app = express();
app.use(cors());

app.get('/', (req,res) => {
    res.send('Welcome to my Social Media App');
});

app.use('/users', userRoute);
app.use(authenticate);
app.use('/posts', postRoute);

app.listen(PORT, async () => {
    try{
        await dbConnect;
        console.log('Connected to the DB');
    } catch (e) {
        console.log('Error occured while connecting to the DB');
        console.log(e.message);
    }
    console.log(`Server is running on http://localhost:${PORT}`);
});