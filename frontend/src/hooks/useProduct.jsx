import { useState, useEffect } from "react";
import { getProducts } from "../services/productService";
export const useProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await getProducts();
      setProducts(res.data);
    };
    fetchProducts();
  }, []);

  return products;
};
