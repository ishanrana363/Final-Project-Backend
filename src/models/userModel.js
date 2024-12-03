const mongoose = require('mongoose');

const {Schema,model} = mongoose;

const userSchema = new Schema({
    username : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
    },
    profileImg : {
        type : String,
        default : "https://api.adorable.io/avatars/285/default.png"
    },
    bio : {
        type : String,
        maxLength : 150
    },
    profassion : {
        type : String,
    },
    role : {
        type : String,
        enum : ['user', 'admin'],
        default : 'user',
    }
},{ timestamps:true,versionKey:false});

const userModel = model("users",userSchema);

module.exports = userModel;  