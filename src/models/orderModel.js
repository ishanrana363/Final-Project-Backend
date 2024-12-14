const mongoose = require("mongoose");

const {Schema,model} = mongoose;

const orderSchema = new Schema({
    userId : String,
    orderId : String,
    products : [
        {
            productId : {
                type : String,
                required : true
            },
            quantity : {
                type : Number,
                required : true
            },
        }
    ],
    email : {
        type : String,
        required : true
    },
    amount : {
        type : Number,
    },
    status:{
        type : String,
        enun : ["Pending","Processing","Shipped","Completed"],
        default : "Pending"
    }
},{timestamps:true,versionKey:false});

const orderModel = model("order",orderSchema);

module.exports = orderModel;