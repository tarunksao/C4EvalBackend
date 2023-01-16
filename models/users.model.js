const {Schema, model} = require('mongoose');

const userSchema = Schema({
    name:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    gender:{type:String, required:true, enum:['Male', 'Female', 'Trans']},
    password:{type:String, required:true},
}, {
    versionKey:false
});

const UserModel = model('user', userSchema);

module.exports = {
    UserModel
};