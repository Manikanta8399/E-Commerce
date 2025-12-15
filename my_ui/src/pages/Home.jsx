import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/getallproduct");
        setProducts(res.data);
        setFilteredProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    
    // Fetch cart count if logged in
    if (token) {
      fetchCartCount();
    }
  }, [token]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.discription?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const fetchCartCount = async () => {
    try {
      const res = await api.get("/getcart");
      const count = res.data.items?.reduce((total, item) => total + item.quantity, 0) || 0;
      setCartCount(count);
    } catch (err) {
      console.error("Error fetching cart count:", err);
    }
  };

  const addToCart = async (productId) => {
    if (!token) {
      navigate("/login");
      return;
    }
    
    try {
      await api.post("/addcart", { productid: productId });
      alert("Product added to cart!");
      fetchCartCount(); // Update cart count
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add to cart");
    }
  };

  if (loading) return <div className="loading">Loading products...</div>;

  return (
    <div className="home">
      <header className="home-header">
        <h1>Welcome to E-Commerce Store</h1>
        <div className="header-links">
          {token ? (
            <>
              <Link to="/cart" className="cart-link">
                🛒 Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
              <Link to="/orders">My Orders</Link>
              {role === "admin" && <Link to="/admin">Admin Panel</Link>}
              <button onClick={() => { localStorage.clear(); navigate("/login"); }} className="logout-btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </header>

      <div className="search-container">
        <input
          type="text"
          placeholder="🔍 Search products by name or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery("")} className="clear-search">✕</button>
        )}
      </div>

      <div className="product-grid">
        {filteredProducts.length === 0 ? (
          <p className="no-products">
            {searchQuery ? `No products found for "${searchQuery}"` : "No products available"}
          </p>
        ) : (
          filteredProducts.map((product) => (
            <div key={product._id} className="product-card">
              <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <img 
                  src={product.image || 'https://via.placeholder.com/280x200?text=No+Image'} 
                  alt={product.name}
                  onError={(e) => e.target.src = 'https://via.placeholder.com/280x200?text=No+Image'}
                />
                <h3>{product.name}</h3>
                <p>{product.discription}</p>
                <p className="price">₹{product.price}</p>
              </Link>
              <button onClick={() => addToCart(product._id)}>Add to Cart</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
