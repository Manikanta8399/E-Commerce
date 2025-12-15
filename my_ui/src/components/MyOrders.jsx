import { useEffect, useState, useContext } from "react";
import { getOrders, cancelOrder } from "../api/api";
import { AuthContext } from "../context/AuthContext";

const MyOrders = () => {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    getOrders(token).then(res => setOrders(res.data));
  }, [token]);

  if (!orders) return <h3>No Orders</h3>;

  return (
    <div>
      <h2>My Orders</h2>
      <div>
        <p>Status: {orders.orderstatus}</p>
        <p>Total: {orders.totalamount}</p>
        {orders.orderstatus === "pending" && (
          <button onClick={() => cancelOrder(orders._id, token)}>
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
