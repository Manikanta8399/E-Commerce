import { useState, useContext } from "react";
import { placeOrder } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const [address, setAddress] = useState("");
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleOrder = async () => {
    await placeOrder(address, token);
    alert("Order placed");
    navigate("/orders");
  };

  return (
    <div>
      <h2>Checkout</h2>
      <input
        placeholder="Delivery Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button onClick={handleOrder}>Place Order</button>
    </div>
  );
};

export default Checkout;
