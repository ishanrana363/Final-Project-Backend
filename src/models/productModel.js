const mongoose = require('mongoose');

const {Schema,model} = mongoose;

const productSchema = new Schema({
    name : {
        type : String,
        required : true,
    },
    category : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        required : true,
    },
    price : {
        type : Number,
        required : true,
    },
    oldPrice : {
        type : Number,
        required : true,
    },
    image : {
        type : String,
        required : true,
    },
    color : {
        type : String,
        required : true,
    },
    author : {
        type : Schema.Types.ObjectId,
        ref : 'user',
        required : true,
    },
    rating : {
        type : Number,
        default : 0,
    }
},{timestamps: true,versionKey:false});

const productModel = model('products',productSchema);

module.exports = productModel;