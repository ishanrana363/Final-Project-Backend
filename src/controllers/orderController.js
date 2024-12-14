const { baseUrl } = require('../utility/baseUrl');

const stripe = require('stripe')(process.env.SECRET_KEY);

const makePayment = async (req, res) => {
    try {
        const { userId, products } = req.body;
        const lineItems = products.map((product)=>({
            price_data : {
                currency : "usd",
                product_data : {
                    name : product.name,
                    images :[product.image]
                },
                unite_amount : Math.round(product.price * 100)
            },
            quantity : product.quantity
        }))
        const session = await stripe.checkout.sessions.create({
            line_items : lineItems,
            payment_method_types : ['card'],
            customer_email : userId,
            mode : 'payment',
            success_url : `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url : `${baseUrl}/cancel`
        });
        res.json({
            id : session.id
        })
    } catch (error) {

    }
};


module.exports = {
    makePayment
}