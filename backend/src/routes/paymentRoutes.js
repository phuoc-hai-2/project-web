import express from 'express';
import { createPaymentUrl, vnpayReturn } from '../controllers/paymentController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route tạo URL thanh toán (Yêu cầu đăng nhập mới được thanh toán)
router.post('/create_payment_url', protect, createPaymentUrl);

// Route xử lý kết quả trả về từ VNPay (VNPay sẽ tự động gọi vào đây, không cần bảo vệ token)
router.get('/vnpay_return', vnpayReturn);

export default router;