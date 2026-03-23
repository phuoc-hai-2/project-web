import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.scss";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminProductAdd from "./pages/AdminProductAdd";
import AdminProductEdit from "./pages/AdminProductEdit";
import CategoryPage from "./pages/CategoryPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/" element={<Home />} />
        <Route>
          <Route path="/category/:slug" element={<CategoryPage />} />
        </Route>
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route element={<AdminRoute />}>
          <Route path="/admin/product/add" element={<AdminProductAdd />} />
          <Route
            path="/admin/product/edit/:id"
            element={<AdminProductEdit />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
