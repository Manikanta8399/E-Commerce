import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const res = await api.get("/getcart");
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      await api.put("/updatecart", { productid: productId, quantity });
      fetchCart();
    } catch (err) {
      console.error("Error updating cart:", err);
    }
  };

  const removeItem = async (productId) => {
    try {
      await api.delete("/delcart", { data: { productid: productId } });
      fetchCart();
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product?.price || 0) * (item.quantity || 1);
    }, 0);
  };

  if (loading) return <div className="loading">Loading cart...</div>;

  return (
    <div>
      <div className="home-header">
        <h1>🛒 Shopping Cart</h1>
        <div className="header-links">
          <Link to="/">Home</Link>
          <Link to="/orders">My Orders</Link>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
        {cartItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem" }}>
            <h2>Your cart is empty</h2>
            <Link to="/">
              <button>Continue Shopping</button>
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item._id} className="cart-item">
                  {item.product?.image && (
                    <img src={item.product.image} alt={item.product.name} />
                  )}
                  <div className="cart-item-details">
                    <h3>{item.product?.name}</h3>
                    <p className="price">₹{item.product?.price}</p>
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)}>
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)}>
                        +
                      </button>
                    </div>
                  </div>
                  <button 
                    className="remove-btn" 
                    onClick={() => removeItem(item.product._id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3>Total: ₹{getTotalPrice()}</h3>
              <Link to="/checkout">
                <button>Proceed to Checkout</button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
