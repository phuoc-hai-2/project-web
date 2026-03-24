import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Header from "../components/Header";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserOrders, setSelectedUserOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page, limit: 20 };
      if (keyword) params.keyword = keyword;
      const { data } = await api.get("/admin/users", { params });
      setUsers(data.users);
      setPages(data.pages);
    } catch (error) {
      alert("Lỗi khi tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  }, [page, keyword]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleViewDetail = async (userId) => {
    try {
      const { data } = await api.get(`/admin/users/${userId}`);
      setSelectedUser(data.user);
      setSelectedUserOrders(data.orders);
      setShowModal(true);
    } catch (error) {
      alert("Lỗi khi tải thông tin người dùng");
    }
  };

  const handleToggleBlock = async (userId, currentBlocked) => {
    const action = currentBlocked ? "mở khóa" : "khóa";
    if (!window.confirm(`Xác nhận ${action} tài khoản này?`)) return;
    try {
      const { data } = await api.put(`/admin/users/${userId}/block`);
      alert(data.message);
      fetchUsers();
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser({ ...selectedUser, isBlocked: data.isBlocked });
      }
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi khi cập nhật tài khoản");
    }
  };

  return (
    <>
      <Header />
      <Container fluid className="my-4 px-4">
        <h2 className="mb-4 fw-bold">👥 Quản lý người dùng</h2>

        <div className="d-flex gap-3 mb-3">
          <Form.Control
            style={{ maxWidth: "300px" }}
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={keyword}
            onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
          />
        </div>

        {loading ? (
          <div className="text-center"><div className="spinner-border text-primary"></div></div>
        ) : (
          <>
            <Table responsive hover className="shadow-sm bg-white align-middle">
              <thead className="table-light">
                <tr>
                  <th>Tên</th>
                  <th>Email</th>
                  <th>Vai trò</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <Badge bg={user.role === "admin" ? "danger" : "secondary"}>
                        {user.role}
                      </Badge>
                    </td>
                    <td>
                      {user.isBlocked ? (
                        <Badge bg="danger">Đã khóa</Badge>
                      ) : (
                        <Badge bg="success">Hoạt động</Badge>
                      )}
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString("vi-VN")}</td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button size="sm" variant="info" onClick={() => handleViewDetail(user._id)}>
                          Chi tiết
                        </Button>
                        {user.role !== "admin" && (
                          <Button
                            size="sm"
                            variant={user.isBlocked ? "success" : "danger"}
                            onClick={() => handleToggleBlock(user._id, user.isBlocked)}
                          >
                            {user.isBlocked ? "Mở khóa" : "Khóa"}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan="6" className="text-center text-muted">Không có người dùng</td></tr>
                )}
              </tbody>
            </Table>

            <div className="d-flex gap-2 justify-content-center">
              {[...Array(pages).keys()].map((p) => (
                <Button
                  key={p + 1}
                  size="sm"
                  variant={page === p + 1 ? "primary" : "outline-primary"}
                  onClick={() => setPage(p + 1)}
                >
                  {p + 1}
                </Button>
              ))}
            </div>
          </>
        )}

        {/* User Detail Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Chi tiết người dùng</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedUser && (
              <div>
                <p><strong>Tên:</strong> {selectedUser.name}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Vai trò:</strong> {selectedUser.role}</p>
                <p><strong>Trạng thái:</strong> {selectedUser.isBlocked ? "🔒 Đã khóa" : "✅ Hoạt động"}</p>
                <p><strong>Ngày tạo:</strong> {new Date(selectedUser.createdAt).toLocaleDateString("vi-VN")}</p>
                <hr />
                <h6>Lịch sử mua hàng ({selectedUserOrders.length} đơn):</h6>
                {selectedUserOrders.length > 0 ? (
                  <Table size="sm" responsive>
                    <thead>
                      <tr>
                        <th>Mã đơn</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                        <th>Ngày</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedUserOrders.map((o) => (
                        <tr key={o._id}>
                          <td style={{ fontSize: "11px" }}>{o._id}</td>
                          <td>{o.totalPrice?.toLocaleString()} VND</td>
                          <td>{o.status}</td>
                          <td>{new Date(o.createdAt).toLocaleDateString("vi-VN")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p className="text-muted">Chưa có đơn hàng nào</p>
                )}
                {selectedUser.role !== "admin" && (
                  <Button
                    variant={selectedUser.isBlocked ? "success" : "danger"}
                    onClick={() => handleToggleBlock(selectedUser._id, selectedUser.isBlocked)}
                  >
                    {selectedUser.isBlocked ? "Mở khóa tài khoản" : "Khóa tài khoản"}
                  </Button>
                )}
              </div>
            )}
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
};

export default AdminUsers;
