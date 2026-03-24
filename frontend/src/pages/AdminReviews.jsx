import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import Header from "../components/Header";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

const STATUS_VARIANTS = { approved: "success", hidden: "danger", pending: "warning" };
const STARS = (n) => "★".repeat(n) + "☆".repeat(5 - n);

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [replyText, setReplyText] = useState("");
  const [selectedReview, setSelectedReview] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page, limit: 20 };
      if (filterStatus) params.status = filterStatus;
      const { data } = await api.get("/reviews/admin", { params });
      setReviews(data.reviews);
      setPages(data.pages);
    } catch (error) {
      alert("Lỗi khi tải reviews");
    } finally {
      setLoading(false);
    }
  }, [page, filterStatus]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleUpdateStatus = async (reviewId, status) => {
    try {
      await api.put(`/reviews/${reviewId}/status`, { status });
      fetchReviews();
    } catch (error) {
      alert("Lỗi khi cập nhật trạng thái");
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Xóa review này?")) return;
    try {
      await api.delete(`/reviews/${reviewId}`);
      fetchReviews();
    } catch (error) {
      alert("Lỗi khi xóa review");
    }
  };

  const openReplyModal = (review) => {
    setSelectedReview(review);
    setReplyText(review.adminReply || "");
    setShowReplyModal(true);
  };

  const handleReply = async () => {
    try {
      await api.put(`/reviews/${selectedReview._id}/reply`, { adminReply: replyText });
      setShowReplyModal(false);
      fetchReviews();
    } catch (error) {
      alert("Lỗi khi gửi phản hồi");
    }
  };

  return (
    <>
      <Header />
      <Container fluid className="my-4 px-4">
        <h2 className="mb-4 fw-bold">⭐ Quản lý Review</h2>

        <div className="d-flex gap-3 mb-3">
          <Form.Select
            style={{ width: "200px" }}
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
          >
            <option value="">Tất cả</option>
            <option value="approved">Đã duyệt</option>
            <option value="pending">Chờ duyệt</option>
            <option value="hidden">Đã ẩn</option>
          </Form.Select>
        </div>

        {loading ? (
          <div className="text-center"><div className="spinner-border text-primary"></div></div>
        ) : (
          <>
            <Table responsive hover className="shadow-sm bg-white align-middle">
              <thead className="table-light">
                <tr>
                  <th>Người dùng</th>
                  <th>Sản phẩm</th>
                  <th>Đánh giá</th>
                  <th>Nội dung</th>
                  <th>Trạng thái</th>
                  <th>Phản hồi</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review._id}>
                    <td>{review.user?.name}<br /><small className="text-muted">{review.user?.email}</small></td>
                    <td>{review.product?.name}</td>
                    <td style={{ color: "gold" }}>{STARS(review.rating)}</td>
                    <td style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {review.comment}
                    </td>
                    <td>
                      <Badge bg={STATUS_VARIANTS[review.status] || "secondary"}>
                        {review.status}
                      </Badge>
                    </td>
                    <td style={{ fontSize: "12px" }}>
                      {review.adminReply ? (
                        <span className="text-success">{review.adminReply.substring(0, 40)}...</span>
                      ) : (
                        <span className="text-muted">Chưa có</span>
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-1 flex-wrap">
                        {review.status !== "approved" && (
                          <Button size="sm" variant="success" onClick={() => handleUpdateStatus(review._id, "approved")}>
                            Duyệt
                          </Button>
                        )}
                        {review.status !== "hidden" && (
                          <Button size="sm" variant="warning" onClick={() => handleUpdateStatus(review._id, "hidden")}>
                            Ẩn
                          </Button>
                        )}
                        <Button size="sm" variant="info" onClick={() => openReplyModal(review)}>
                          Trả lời
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleDelete(review._id)}>
                          Xóa
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {reviews.length === 0 && (
                  <tr><td colSpan="7" className="text-center text-muted">Không có review</td></tr>
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

        {/* Reply Modal */}
        <Modal show={showReplyModal} onHide={() => setShowReplyModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Trả lời review</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedReview && (
              <div>
                <p><strong>Review của:</strong> {selectedReview.user?.name}</p>
                <p><strong>Sản phẩm:</strong> {selectedReview.product?.name}</p>
                <p>{selectedReview.comment}</p>
                <Form.Group>
                  <Form.Label>Phản hồi của admin:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Nhập phản hồi..."
                  />
                </Form.Group>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowReplyModal(false)}>Hủy</Button>
            <Button variant="primary" onClick={handleReply}>Gửi phản hồi</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default AdminReviews;
