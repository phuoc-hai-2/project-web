import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";
import { deleteProduct } from "../services/productService";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const handleAddToCart = () => {
    const cartKey = userInfo ? `cart_${userInfo._id}` : "cart_guest";
    const cartItems = JSON.parse(localStorage.getItem(cartKey)) || [];
    const existItem = cartItems.find((x) => x.product === product._id);

    let updatedCart;
    if (existItem) {
      updatedCart = cartItems.map((x) =>
        x.product === existItem.product ? { ...x, qty: x.qty + 1 } : x,
      );
    } else {
      updatedCart = [
        ...cartItems,
        {
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          qty: 1,
        },
      ];
    }
    localStorage.setItem(cartKey, JSON.stringify(updatedCart));
    navigate("/cart");
  };

  const goToDetail = () => {
    navigate(`/product/${product._id}`);
  };

  const handleDelete = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      try {
        await deleteProduct(product._id);
        alert("Đã xóa sản phẩm");
        window.location.reload();
      } catch (error) {
        alert("Lỗi khi xóa sản phẩm");
      }
    }
  };

  const handleEdit = () => {
    navigate(`/admin/product/edit/${product._id}`);
  };

  return (
    <Card className="product-card">
      <div className="card-left">
        <img src={product.image} alt={product.name} />
      </div>

      <div className="card-right">
        <Card.Body>
          <Card.Title className="title" onClick={goToDetail}>
            {product.name}
          </Card.Title>

          <div className="category">{product.category}</div>

          <div className="bottom">
            <span className="price">{product.price}đ</span>

            <Button className="cart-btn" onClick={handleAddToCart}>
              <img
                src="../src/assets/icons/shopping-cart.png"
                alt="Add to Cart"
              />
            </Button>
          </div>
          <div className="admin-actions">
            {userInfo && userInfo.role === "admin" && (
              <div className="d-flex justify-content-between mt-2">
                <Button
                  variant="warning"
                  size="sm"
                  className="w-50 me-1 fw-bold text-dark"
                  onClick={handleEdit}
                >
                  Sửa
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  className="w-50 ms-1 fw-bold"
                  onClick={handleDelete}
                >
                  Xóa
                </Button>
              </div>
            )}
          </div>
        </Card.Body>
      </div>
    </Card>
  );
};

export default ProductCard;
