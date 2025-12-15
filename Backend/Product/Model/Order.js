const mongoose = require("mongoose");

const orderschema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Person",
    required: true,
  },

  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],

  address: {
    type: String,
    required: true,
  },

  totalamount: {
    type: Number,
    required: true,
  },

  paymentstatus: {
    type: String,
    enum: ["success", "pending", "failed"],
    default: "pending",
  },

  paymentmethod: {
    type: String,
    default: "TEST_PAYMENT",
  },

  orderstatus: {
    type: String,
    enum: ["pending", "shipped", "out of delivery", "delivered", "cancelled"],
    default: "pending",
  },

  // 🔹 Razorpay fields (IMPORTANT)
  razorpayOrderId: {
    type: String,
  },

  razorpayPaymentId: {
    type: String,
  },
}, { timestamps: true }); // Add timestamps

module.exports = mongoose.model("Order", orderschema);
  