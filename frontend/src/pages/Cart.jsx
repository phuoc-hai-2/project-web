import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Header from "../components/Header";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [emailReceive, setEmailReceive] = useState("");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const cartKey = userInfo ? `cart_${userInfo._id}` : "cart_guest";

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
    setCartItems(storedCart);
  }, [cartKey]);

  const updateCartAndStorage = (updatedCart) => {
    setCartItems(updatedCart);
    localStorage.setItem(cartKey, JSON.stringify(updatedCart));
  };

  const removeFromCartHandler = (id) => {
    const updatedCart = cartItems.filter((item) => item.product !== id);
    updateCartAndStorage(updatedCart);
  };

  const updateQtyHandler = (id, newQty) => {
    if (newQty < 1) return;
    const updatedCart = cartItems.map((item) =>
      item.product === id ? { ...item, qty: newQty } : item,
    );
    updateCartAndStorage(updatedCart);
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );

  const handleCheckout = async () => {
    if (!userInfo) {
      alert("Vui lòng đăng nhập để thanh toán!");
      navigate("/login");
      return;
    }
    if (cartItems.length === 0) {
      alert("Giỏ hàng đang trống!");
      return;
    }
    if (!emailReceive) {
      alert("Vui lòng nhập email nhận hàng!");
      return;
    }

    try {
      const orderRes = await api.post("/orders", {
        orderItems: cartItems,
        digitalDeliveryInfo: { emailReceive },
        paymentMethod: "VNPAY",
        totalPrice,
      });

      const paymentRes = await api.post("/payments/create_payment_url", {
        amount: totalPrice,
        orderInfo: `Thanh toan don hang ${orderRes.data._id}`,
        orderId: orderRes.data._id,
      });

      localStorage.removeItem(cartKey);
      window.location.href = paymentRes.data.url;
    } catch (error) {
      alert("Lỗi thanh toán. Vui lòng thử lại.");
    }
  };

  return (
    <>
      <Header />
      <Container className="my-5">
        <h2 className="mb-4 text-primary fw-bold">Giỏ hàng của bạn</h2>
        {cartItems.length === 0 ? (
          <div className="alert alert-info shadow-sm">
            Giỏ hàng trống.{" "}
            <Link to="/home" className="fw-bold text-decoration-none">
              Quay lại mua sắm
            </Link>
          </div>
        ) : (
          <div className="row">
            <div className="col-lg-8">
              <Table
                responsive
                hover
                className="shadow-sm bg-white align-middle"
              >
                <thead className="table-light">
                  <tr>
                    <th>Sản phẩm</th>
                    <th className="text-center">Số lượng</th>
                    <th>Đơn giá</th>
                    <th>Thành tiền</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.product}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              marginRight: "15px",
                            }}
                          />
                          <Link
                            to={`/product/${item.product}`}
                            className="text-decoration-none text-dark fw-bold"
                          >
                            {item.name}
                          </Link>
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center align-items-center">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() =>
                              updateQtyHandler(item.product, item.qty - 1)
                            }
                          >
                            -
                          </Button>
                          <span className="mx-3 fw-bold">{item.qty}</span>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() =>
                              updateQtyHandler(item.product, item.qty + 1)
                            }
                          >
                            +
                          </Button>
                        </div>
                      </td>
                      <td>{item.price.toLocaleString()} đ</td>
                      <td className="fw-bold text-danger">
                        {(item.price * item.qty).toLocaleString()} đ
                      </td>
                      <td className="text-end">
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => removeFromCartHandler(item.product)}
                        >
                          Xóa
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <div className="col-lg-4">
              <div className="card shadow-sm border-0">
                <div className="card-body p-4">
                  <h4 className="card-title mb-4">Tổng thanh toán</h4>
                  <div className="d-flex justify-content-between mb-4">
                    <span className="fs-5">Tổng tiền:</span>
                    <span className="fs-4 fw-bold text-danger">
                      {totalPrice.toLocaleString()} VND
                    </span>
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-bold">
                      Email nhận hàng (Bắt buộc):
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Nhập email của bạn..."
                      value={emailReceive}
                      onChange={(e) => setEmailReceive(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    variant="success"
                    size="lg"
                    className="w-100 fw-bold"
                    onClick={handleCheckout}
                  >
                    Thanh toán VNPay
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </>
  );
};

export default Cart;
