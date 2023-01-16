const {Schema, model} = require('mongoose');

const postSchema = Schema({
    title:{type:String, required:true},
    body:{type:String, required:true},
    device:{type:String, required:true, enum:['PC', 'TABLET', 'MOBILE']},
    user:{type:Schema.Types.ObjectId, ref:'user'}
}, {
    versionKey:false
});

const PostModel = model('post', postSchema);

module.exports = {
    PostModel
};