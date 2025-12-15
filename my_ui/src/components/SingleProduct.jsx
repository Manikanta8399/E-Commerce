import React, { useContext } from "react";
import { addCart } from "../api/api";
import { AuthContext } from "../context/AuthContext";

const SingleProduct = ({ product }) => {
  const { token } = useContext(AuthContext);

  const handleAddCart = async () => {
    if (!token) return alert("Login first");
    await addCart(product._id, token);
    alert("Added to cart");
  };

  return (
    <div>
      <h3>{product.name}</h3>
      <p>{product.discription}</p>
      <p>Price: {product.price}</p>
      <button onClick={handleAddCart}>Add to Cart</button>
    </div>
  );
};

export default SingleProduct;
