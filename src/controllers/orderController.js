const orderModel = require('../models/orderModel');
const { baseUrl } = require('../utility/baseUrl');
const { errorResponse, successResponse } = require('../utility/response');

const stripe = require('stripe')(process.env.SECRET_KEY);

const makePayment = async (req, res) => {
    try {
        const { userId, products } = req.body;
        const lineItems = products.map((product) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: product.name,
                    images: [product.image]
                },
                unit_amount: Math.round(product.price * 100)
            },
            quantity: product.quantity
        }))
        const session = await stripe.checkout.sessions.create({
            line_items: lineItems,
            payment_method_types: ['card'],
            customer_email: userId.email,
            mode: 'payment',
            success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/cancel`
        });
        res.json({
            id: session.id
        })
    } catch (error) {
        return errorResponse(res, 500, "something went wrong", error);
    }
};


const confirmOrder = async (req, res) => {
    try {
        const { session_id } = req.body;
        const session = await stripe.checkout.sessions.retrieve(session_id, {
            expand: ["line_items", 'payment_intent']
        });

        const paymentIntentId = session.payment_intent.id;

        let order = await orderModel.findOne({ orderId: paymentIntentId });

        if (!order) {
            const lineItems = session.line_items.data.map((item) => ({
                productId: item.price.product,
                quantity: item.quantity
            }));

            const amount = session.amount_total / 100;

            order = new orderModel({
                orderId: paymentIntentId,
                products: lineItems,
                amount: amount,
                email: session.customer_details.email,
                status: session.payment_intent.status === "succeeded" ? "pending" : "failed" // Fixed
            });
        } else {
            order.status = session.payment_intent.status === "succeeded" ? "pending" : "failed"; // Fixed
        }

        await order.save();
        return successResponse(res, 200, "Order created successfully", order);
    } catch (error) {
        console.log(error);
        return errorResponse(res, 500, "Something went wrong", error);
    }
};


// order by email id

const getOrderByEmail = async (req, res) => {
    const email = req.params.email;
    try {
        if (!email) {
            return errorResponse(res, 400, "Email required");
        }
        const orders = await orderModel.find({ email }).sort({ createdAt: -1 })
        if (orders.length === 0) {
            return errorResponse(res, 404, "Order not found")
        }
        return successResponse(res, 200, "Orders fetched successfully", orders);
    } catch (error) {
        return errorResponse(res, 500, "Something went wrong", error)
    }
};

// order product by id

const getOrderByProductId = async (req, res) => {
    const productId = req.params.id;
    try {
        if (!productId) {
            return errorResponse(res, 400, "Product id required");
        }
        const orders = await orderModel.findOne({ _id: productId });
        if (!orders) {
            return errorResponse(res, 404, "Order not found")
        }
        return successResponse(res, 200, "Orders fetched successfully", orders);
    } catch (error) {
        return errorResponse(res, 500, "Something went wrong", error)
    }
};

// all order by admin

const allOrderByAdmin = async (req, res) => {
    try {
        const orders = await orderModel.find().sort({ createdAt: -1 })
        if (orders.length === 0) {
            return errorResponse(res, 404, "Order not found")
        }
        return successResponse(res, 200, "Orders fetched successfully", orders);
    } catch (error) {
        return errorResponse(res, 500, "Something went wrong", error)
    }
};

// order status update

const orderStatusUpdate = async (req, res) => {
    const id = req.params.id;
    const status = req.body.status;
    const filter = {
        _id: id,
    }
    try {
        let data = await orderModel.findByIdAndUpdate(filter, { status: status }, { new: true, runValidators: true });
        if (!data) {
            return errorResponse(res, 404, "Order not found")
        }
        return successResponse(res, 200, "Order status updated successfully", data);
    } catch (error) {
        return errorResponse(res, 500, "Something went wrong", error);
    }
};

// order delete

const deleteOrder = async (req, res) => {
    const id = req.params.id;
    try {
        let data = await orderModel.findByIdAndDelete(id);
        if (!data) {
            return errorResponse(res, 404, "Order not found")
        }
        return successResponse(res, 200, "Order deleted successfully", data);
    } catch (error) {
        return errorResponse(res, 500, "Something went wrong", error);
    }
};


module.exports = {
    makePayment,
    confirmOrder,
    getOrderByEmail,
    getOrderByProductId,
    allOrderByAdmin,
    orderStatusUpdate,
    deleteOrder
}