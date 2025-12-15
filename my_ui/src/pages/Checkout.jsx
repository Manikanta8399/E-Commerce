import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";

export default function Checkout() {
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await api.get("/getcart");
      setCart(res.data);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  const getTotalPrice = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity;
    }, 0);
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    
    if (!address.trim()) {
      alert("Please enter delivery address");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/placeorder", { address, phone });
      console.log("Order created:", res.data);
      
      if (res.data._id) {
        navigate(`/payment/${res.data._id}`);
      } else {
        alert("Order created but ID missing");
      }
    } catch (err) {
      console.error("Place order error:", err);
      alert("Failed to place order: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="home-header">
        <h1>Checkout</h1>
        <div className="header-links">
          <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
          <Link to="/">Home</Link>
          <Link to="/cart">Cart</Link>
        </div>
      </div>

      <div style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        {/* Delivery Information Form */}
        <div>
          <h2>Delivery Information</h2>
          
          <form onSubmit={placeOrder} style={{ marginTop: "1.5rem" }}>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="form-group">
              <label>Delivery Address *</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House No., Street, Landmark, City, State, PIN Code"
                rows="4"
                required
              />
            </div>

            <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={loading}
                style={{ flex: 1 }}
              >
                {loading ? "Processing..." : "Place Order & Pay"}
              </button>
              
              <Link to="/cart" style={{ flex: 1 }}>
                <button type="button" className="btn-secondary" style={{ width: "100%" }}>
                  Back to Cart
                </button>
              </Link>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <h2>Order Summary</h2>
          <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", marginTop: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            {cart?.items?.map((item, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px solid #e0e0e0" }}>
                <div>
                  <p style={{ fontWeight: "600", marginBottom: "0.25rem" }}>{item.product?.name}</p>
                  <p style={{ color: "#666", fontSize: "0.9rem" }}>Qty: {item.quantity}</p>
                </div>
                <p style={{ fontWeight: "600" }}>₹{(item.product?.price || 0) * item.quantity}</p>
              </div>
            ))}
            
            <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "2px solid #667eea" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem", fontWeight: "bold" }}>
                <span>Total Amount:</span>
                <span style={{ color: "#667eea" }}>₹{getTotalPrice()}</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: "1.5rem", padding: "1rem", background: "#f0f7ff", borderRadius: "8px" }}>
            <p style={{ fontSize: "0.9rem", color: "#666", margin: 0 }}>
              💡 You will be redirected to payment page after placing order
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
