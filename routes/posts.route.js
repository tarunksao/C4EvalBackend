require('dotenv').config();
const express = require('express');
const { PostModel } = require('../models/posts.model');
const jwt = require('jsonwebtoken');

const app = express.Router();
app.use(express.json());

app.get('/', async (req,res) => {
    const {device, device1, device2} = req.query;
    const token = req.headers.authorization;
    const decode = jwt.verify(token, process.env.secretKey);
    // console.log(decode);
    const user = decode.userId;
    try{
        if (device1 && device2) {
            const device1Post = await PostModel.find({user,device:device1}).populate('user');
            const device2Post = await PostModel.find({user,device:device2}).populate('user');
            if (device1Post.length>0 && device2Post.length>0) {
                res.send(device1Post.concat(device2Post));
            } else if (device1Post.length>0) {
                res.send(device1Post);
            } else if (device2Post.length>0) {
                res.send(device2Post);
            }
        } else if (device){
            const allPosts = await PostModel.find({user, device}).populate('user');
            res.send(allPosts);
        } else {
            const allPosts = await PostModel.find({user}).populate('user');
            res.send(allPosts);
        }
    } catch (e) {
        res.send({message:'Something went wrong', error:e.message});
    }
});

app.post('/create', async (req,res) => {
    const {title, body, device} = req.body;
    const token = req.headers.authorization;
    const decode = jwt.verify(token, process.env.secretKey);
    // console.log(decode);
    const user = decode.userId;

    try{
        const newPost = new PostModel({title, body, device, user});
        await newPost.save();
        res.send({message:`${decode.username} created a new Post`, newPost});
    } catch (e) {
        res.send({message:'Something went wrong', error:e.message});
    }
});

app.delete('/delete/:id', async (req,res) => {
    const {id} = req.params;
    const token = req.headers.authorization;
    const decode = jwt.verify(token, process.env.secretKey);
    // console.log(decode);
    const user = decode.userId;
    try {
        const findPost = await PostModel.find({_id:id, user});
        if (findPost.length>0) {
            const deletePost = await PostModel.findByIdAndDelete({_id:id});
            res.send({message:`Post with id-${id} has been deleted.`, deletePost});
        } else {
            res.send('You are not authorized for this activity');
        }
    } catch (e) {
        res.send({'Message':'Something went wrong', 'Error':e.message});
    }
});

app.patch('/update/:id', async (req,res) => {
    const payload = req.body;
    const {id} = req.params;
    const token = req.headers.authorization;
    const decode = jwt.verify(token, process.env.secretKey);
    // console.log(decode);
    const user = decode.userId;
    try {
        const findPost = await PostModel.find({_id:id, user});
        if (findPost.length>0) {
            const updatePost = await PostModel.findByIdAndUpdate({_id:id}, payload);
            res.send({message:`Post with id-${id} has been updated.`});
        } else {
            res.send('You are not authorized for this activity');
        }
    } catch (e) {
        res.send({'Message':'Something went wrong', 'Error':e.message});
    }
});

module.exports = app;
