import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/getsingleproduct/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error("Error fetching product:", err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      await api.post("/addcart", { productid: id, quantity });
      alert("Added to cart successfully!");
      navigate("/cart");
    } catch (err) {
      alert("Failed to add to cart");
    }
  };

  if (loading) return <div className="loading">Loading product...</div>;
  if (!product) return <div className="loading">Product not found</div>;

  return (
    <div>
      <div className="home-header">
        <h1>Product Details</h1>
        <div className="header-links">
          <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
          <Link to="/">Home</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/orders">My Orders</Link>
        </div>
      </div>

      <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div className="product-details-container">
          <div className="product-image-large">
            <img src={product.image} alt={product.name} />
          </div>
          <div className="product-info-details">
            <h1>{product.name}</h1>
            <p className="product-price">₹{product.price}</p>
            <p className="product-description">{product.discription}</p>
            
            <div className="quantity-selector">
              <label>Quantity:</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              />
            </div>

            <button onClick={addToCart} className="add-to-cart-btn">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
