import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Menu() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  return (
    <ul>
      {categories.map((c, index) => (
        <li key={index}>
          <Link to={`/category/${c}`}>{c}</Link>
        </li>
      ))}
    </ul>
  );
}

export default Menu;
