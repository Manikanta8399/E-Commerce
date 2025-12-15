import React, { useEffect, useState } from "react";
import { getAllProducts } from "../api/api";
import SingleProduct from "./SingleProduct";

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await getAllProducts();
      setProducts(res.data);
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <h2>All Products</h2>
      <div>
        {products.map((p) => (
          <SingleProduct key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
};

export default Home;
