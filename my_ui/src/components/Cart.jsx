import { useEffect, useState, useContext } from "react";
import { getCart, updateCart, removeCartItem } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { token } = useContext(AuthContext);
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    getCart(token).then(res => setCart(res.data));
  }, [token]);

  const updateQty = (id, qty) => {
    updateCart(id, qty, token).then(res => setCart(res.data));
  };

  const removeItem = (id) => {
    removeCartItem(id, token).then(res => setCart(res.data));
  };

  if (!cart) return <h3>Cart is empty</h3>;

  return (
    <div>
      <h2>Cart</h2>
      {cart.items.map(i => (
        <div key={i.product._id}>
          <h4>{i.product.name}</h4>
          <p>Qty: {i.quantity}</p>
          <button onClick={() => updateQty(i.product._id, i.quantity + 1)}>+</button>
          <button onClick={() => updateQty(i.product._id, i.quantity - 1)}>-</button>
          <button onClick={() => removeItem(i.product._id)}>Remove</button>
        </div>
      ))}
      <button onClick={() => navigate("/checkout")}>Checkout</button>
    </div>
  );
};

export default Cart;
