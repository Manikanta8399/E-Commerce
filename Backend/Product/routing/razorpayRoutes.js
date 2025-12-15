const express = require("express");
const router = express.Router();
const razorpayController = require("../controller/razorpayController");
const jwt = require("jsonwebtoken");

const secret = process.env.secretkey;

// Auth middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("Login required");

  try {
    req.user = jwt.verify(token, secret);
    next();
  } catch {
    res.status(401).send("Invalid token");
  }
};

// Create Razorpay Order
router.post(
  "/razorpay/create-order",
  authMiddleware,
  razorpayController.createRazorpayOrder
);

// Verify Payment
router.post(
  "/razorpay/verify",
  authMiddleware,
  razorpayController.verifyPayment
);

module.exports = router;
