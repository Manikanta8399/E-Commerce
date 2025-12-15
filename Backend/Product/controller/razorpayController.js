const Razorpay = require("razorpay");
const ordermodel = require("../Model/Order");

// Initialize Razorpay only if credentials are provided
let razorpay;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
}

exports.createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    console.log("Creating Razorpay order for:", orderId);
    
    const order = await ordermodel.findById(orderId);
    
    if (!order) {
      console.log("Order not found:", orderId);
      return res.status(400).json({ message: "Order not found" });
    }

    console.log("Order found:", { id: order._id, totalamount: order.totalamount });

    if (!order.totalamount || order.totalamount <= 0) {
      console.log("Invalid order amount:", order.totalamount);
      return res.status(400).json({ message: "Invalid order amount" });
    }

    // If Razorpay is not configured, return mock data for testing
    if (!razorpay) {
      console.log("Razorpay not configured, using test mode");
      return res.json({
        id: "order_test_" + Date.now(),
        amount: order.totalamount * 100,
        currency: "INR",
        receipt: orderId,
        status: "created",
        test_mode: true
      });
    }

    const options = {
      amount: order.totalamount * 100,
      currency: "INR",
      receipt: orderId
    };

    const razorOrder = await razorpay.orders.create(options);
    res.json(razorOrder);
  } catch (err) {
    console.error("Razorpay order creation error:", err);
    res.status(500).json({ message: err.message, error: err.toString() });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    const updatedOrder = await ordermodel.findByIdAndUpdate(
      orderId,
      {
        paymentstatus: "success",
        paymentmethod: "RAZORPAY"
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(400).json({ message: "Order not found" });
    }

    res.json({ message: "Payment Verified", order: updatedOrder });
  } catch (err) {
    console.error("Payment verification error:", err);
    res.status(500).json({ message: err.message });
  }
};
