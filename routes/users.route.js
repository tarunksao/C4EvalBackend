require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const { UserModel } = require('../models/users.model');
const jwt = require('jsonwebtoken');

const app = express.Router();
app.use(express.json());

app.get('/', async (req,res) => {
    try{
        const allUsers = await UserModel.find();
        res.send(allUsers);
    } catch (e) {
        res.send({'Message':'Something went wrong', 'Error':e.message});
    }
});

app.post('/register', (req,res) => {
    const {name, email, gender, password} = req.body;
    try{
        bcrypt.hash(password, 5, async (err, hash) => {
            if (err) {
                res.send({'message':'Something went wrong', 'Error':e.message});
            } else {
                const newUser = new UserModel({name, email, gender, password:hash});
                await newUser.save();
                res.send({'message':'New user registerd successfully', newUser});
            }
        });
    } catch (e) {
        res.send({'Message':'Something went wrong', 'Error':e.message});
    }
});

app.post('/login', async (req,res) => {
    const {email, password} = req.body;
    try{
        const user = await UserModel.find({email});
        if (user.length>0) {
            bcrypt.compare(password, user[0].password, (err, result) => {
                if (err) {
                    res.send('Wrong Credentials');
                } else {
                    const token = jwt.sign({userId:user[0].id, username:user[0].name}, process.env.secretKey);
                    res.setHeader('Authorization', token);
                    res.send({'message':'Login successful', token});
                }
            });
        }
    } catch (e) {
        res.send({'Message':'Something went wrong', 'Error':e.message});
    }
});

module.exports = app;
