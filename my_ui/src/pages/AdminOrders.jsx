import axios from "axios";
import { useEffect, useState } from "react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:4500/api/getallorder", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }).then(res => setOrders(res.data));
  }, []);

  const updateStatus = async (id, status) => {
    await axios.put(
      `http://localhost:4500/api/updatestatus/${id}`,
      { orderstatus: status },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );
    window.location.reload();
  };

  return (
    <div>
      <h2>Admin Orders</h2>
      {orders.map(o => (
        <div key={o._id}>
          <p>User: {o.user}</p>
          <p>Total: ₹{o.totalamount}</p>
          <p>Payment: {o.paymentstatus}</p>
          <p>Method: {o.paymentmethod}</p>
          <p>Status: {o.orderstatus}</p>

          <select onChange={e => updateStatus(o._id, e.target.value)}>
            <option>pending</option>
            <option>shipped</option>
            <option>out of delivery</option>
            <option>delivered</option>
            <option>cancelled</option>
          </select>
        </div>
      ))}
    </div>
  );
}
