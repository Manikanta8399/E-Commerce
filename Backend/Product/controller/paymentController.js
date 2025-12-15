const Razorpay = require("razorpay");
const ordermodel = require("../Model/Order");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.createRazorpayOrder = async (req, res) => {
  const { orderId } = req.body;

  const order = await ordermodel.findById(orderId);
  if (!order) return res.status(400).send("Order not found");

  const options = {
    amount: order.totalamount * 100,
    currency: "INR",
    receipt: orderId
  };

  const razorOrder = await razorpay.orders.create(options);
  res.json(razorOrder);
};


exports.verifyPayment = async (req, res) => {
  const { orderId } = req.body;

  await ordermodel.findByIdAndUpdate(orderId, {
    paymentstatus: "success",
    paymentmethod: "RAZORPAY"
  });

  res.json({ message: "Payment Verified" });
};
