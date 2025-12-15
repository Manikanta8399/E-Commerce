import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/api";

export default function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const payWithRazorpay = async () => {
    try {
      const { data } = await api.post("/razorpay/create-order", { orderId });

      // If in test mode (no Razorpay credentials), simulate payment
      if (data.test_mode) {
        const confirm = window.confirm(
          `Test Mode Payment\n\nAmount: ₹${data.amount / 100}\n\nClick OK to simulate successful payment`
        );
        
        if (confirm) {
          await api.post("/razorpay/verify", { orderId });
          alert("Payment Successful! (Test Mode)");
          navigate("/orders");
        }
        return;
      }

      // Real Razorpay payment flow
      const options = {
        key: "rzp_test_xxxxx", // Replace with your actual Razorpay key
        amount: data.amount,
        currency: "INR",
        name: "E-Commerce Store",
        description: "Product Purchase",
        order_id: data.id,
        handler: async (response) => {
          try {
            await api.post("/razorpay/verify", {
              orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            alert("Payment Successful!");
            navigate("/orders");
          } catch (err) {
            alert("Payment verification failed");
          }
        },
        prefill: {
          name: "",
          email: "",
          contact: ""
        },
        theme: {
          color: "#667eea"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment initialization failed. " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      <div className="home-header">
        <h1>Payment</h1>
        <div className="header-links">
          <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
          <Link to="/">Home</Link>
          <Link to="/orders">My Orders</Link>
        </div>
      </div>

      <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
        <h2>Complete Your Payment</h2>
        <p style={{ color: "#666", marginBottom: "2rem" }}>Order ID: {orderId}</p>
        
        <button onClick={payWithRazorpay} className="btn-primary" style={{ fontSize: "1.1rem", padding: "1rem 2rem" }}>
          💳 Pay with Razorpay
        </button>
        
        <div style={{ marginTop: "2rem" }}>
          <Link to="/orders">
            <button className="btn-secondary">View My Orders</button>
          </Link>
        </div>
      
        <p style={{ marginTop: "2rem", fontSize: "0.9rem", color: "#999" }}>
          Note: If Razorpay is not configured, test mode will be used
        </p>
        <p style={{ marginTop: "0.5rem", fontSize: "0.85rem", color: "#666" }}>
          💡 Your order has been placed. Complete payment to confirm.
        </p>
      </div>
    </div>
  );
}
