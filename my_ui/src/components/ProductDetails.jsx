import { useEffect, useState, useContext } from "react";
import { getProduct, addCart } from "../api/api";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProductDetails = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    getProduct(id).then(res => setProduct(res.data));
  }, [id]);

  if (!product) return <h3>Loading...</h3>;

  return (
    <div>
      <h2>{product.name}</h2>
      <p>{product.discription}</p>
      <p>₹{product.price}</p>
      <button onClick={() => addCart(product._id, token)}>
        Add to Cart
      </button>
    </div>
  );
};

export default ProductDetails;
