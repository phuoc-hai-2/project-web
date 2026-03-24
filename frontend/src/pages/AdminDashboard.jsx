import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Header from "../components/Header";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/admin/dashboard");
        setStats(data);
      } catch (error) {
        alert("Lỗi khi tải thống kê");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;
  if (!stats) return null;

  const revenueData = (stats.revenueByMonth || []).map((r) => ({
    name: `${MONTH_NAMES[r._id.month - 1]} ${r._id.year}`,
    revenue: r.revenue,
    orders: r.count,
  }));

  const userGrowthData = (stats.userGrowth || []).map((u) => ({
    name: `${MONTH_NAMES[u._id.month - 1]} ${u._id.year}`,
    users: u.count,
  }));

  const statusMap = {};
  (stats.ordersByStatus || []).forEach((s) => { statusMap[s._id] = s.count; });

  return (
    <>
      <Header />
      <Container fluid className="my-4 px-4">
        <h2 className="mb-4 fw-bold">📊 Dashboard Admin</h2>

        {/* Stats Cards */}
        <Row className="g-4 mb-4">
          <Col md={3}>
            <Card className="border-0 shadow-sm text-white bg-primary">
              <Card.Body>
                <h6>Tổng doanh thu</h6>
                <h3>{(stats.totalRevenue || 0).toLocaleString()} VND</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm text-white bg-success">
              <Card.Body>
                <h6>Số người dùng</h6>
                <h3>{stats.totalUsers}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm text-white bg-warning">
              <Card.Body>
                <h6>Số đơn hàng</h6>
                <h3>{stats.totalOrders}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm text-white bg-info">
              <Card.Body>
                <h6>Đơn hoàn thành</h6>
                <h3>{statusMap["Completed"] || 0}</h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Quick Links */}
        <Row className="g-3 mb-4">
          <Col md={3}>
            <button className="btn btn-outline-primary w-100" onClick={() => navigate("/admin/products")}>
              📦 Quản lý sản phẩm
            </button>
          </Col>
          <Col md={3}>
            <button className="btn btn-outline-warning w-100" onClick={() => navigate("/admin/orders")}>
              🧾 Quản lý đơn hàng
            </button>
          </Col>
          <Col md={3}>
            <button className="btn btn-outline-success w-100" onClick={() => navigate("/admin/users")}>
              👥 Quản lý người dùng
            </button>
          </Col>
          <Col md={3}>
            <button className="btn btn-outline-secondary w-100" onClick={() => navigate("/admin/reviews")}>
              ⭐ Quản lý review
            </button>
          </Col>
        </Row>

        {/* Charts */}
        <Row className="g-4 mb-4">
          <Col md={8}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <h5 className="fw-bold mb-3">📈 Doanh thu theo tháng</h5>
                {revenueData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(v) => v.toLocaleString() + " VND"} />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#007bff" name="Doanh thu" />
                      <Line type="monotone" dataKey="orders" stroke="#28a745" name="Đơn hàng" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-muted">Chưa có dữ liệu</p>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <h5 className="fw-bold mb-3">👥 Tăng trưởng user</h5>
                {userGrowthData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="users" fill="#28a745" name="Người dùng mới" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-muted">Chưa có dữ liệu</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Top Products */}
        <Row>
          <Col md={12}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <h5 className="fw-bold mb-3">🏆 Top sản phẩm bán chạy</h5>
                <Table responsive hover className="align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Sản phẩm</th>
                      <th>Đã bán</th>
                      <th>Doanh thu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(stats.topProducts || []).map((p, i) => (
                      <tr key={p._id}>
                        <td>{i + 1}</td>
                        <td>{p.name}</td>
                        <td>{p.totalSold}</td>
                        <td>{(p.totalRevenue || 0).toLocaleString()} VND</td>
                      </tr>
                    ))}
                    {!stats.topProducts?.length && (
                      <tr><td colSpan="4" className="text-center text-muted">Chưa có dữ liệu</td></tr>
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AdminDashboard;
