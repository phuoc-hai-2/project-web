import { buildPaymentUrl } from '../services/vnpayService.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Tạo URL thanh toán VNPay
// @route   POST /api/payments/create_payment_url
export const createPaymentUrl = (req, res) => {
  try {
    // Nhận thêm orderId từ Frontend gửi lên
    const { amount, orderInfo, orderId } = req.body; 

    if (!amount || !orderInfo || !orderId) {
      return res.status(400).json({ message: 'Thiếu thông tin tạo thanh toán' });
    }

    // Truyền orderId vào service
    const paymentUrl = buildPaymentUrl(req, amount, orderInfo, orderId);
    res.status(200).json({ url: paymentUrl });
  } catch (error) {
    console.log("=== BẮT ĐƯỢC LỖI VNPAY ===", error); // In lỗi ra màn hình Terminal
    res.status(500).json({ message: 'Lỗi khi tạo URL thanh toán', error: error.message }); // Báo lỗi chi tiết ra Postman
  }
};

// @desc    Xử lý kết quả trả về từ VNPay & TỰ ĐỘNG GIAO HÀNG
// @route   GET /api/payments/vnpay_return
export const vnpayReturn = async (req, res) => {
  try {
    let vnp_Params = req.query;
    let rspCode = vnp_Params['vnp_ResponseCode'];
    let orderId = vnp_Params['vnp_TxnRef']; // Lấy ID đơn hàng từ VNPay trả về

    if (rspCode === '00') {
      // 1. Tìm đơn hàng trong Database
      const order = await Order.findById(orderId);
      
      if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
      if (order.isPaid) return res.status(200).json({ message: 'Đơn hàng này đã được giao Key rồi!' });

      // 2. Đánh dấu đã thanh toán
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: vnp_Params['vnp_TransactionNo'],
        status: rspCode,
        update_time: Date.now().toString()
      };

      let allDelivered = true; // Biến cờ kiểm tra xem có giao thành công hết không

      // 3. MỞ KHO VÀ LẤY KEY CHO TỪNG MÓN HÀNG
      for (let item of order.orderItems) {
        const product = await Product.findById(item.product);

        if (product && product.productType === 'Key') {
          // Lọc ra các Key chưa bán
          const availableKeys = product.digitalVault.filter(k => !k.isSold);

          if (availableKeys.length >= item.qty) {
            let deliveredKeys = [];
            // Bốc đúng số lượng Key khách mua
            for (let i = 0; i < item.qty; i++) {
              availableKeys[i].isSold = true;        // Đánh dấu Key đã bán
              availableKeys[i].soldAt = Date.now();  // Ghi nhận thời gian bán
              deliveredKeys.push(availableKeys[i].content); // Đưa Key vào giỏ
            }
            // Gắn Key vào đơn hàng cho khách (nếu mua nhiều Key, cách nhau bởi dấu | )
            item.deliveredContent = deliveredKeys.join(' | ');
          } else {
            // Trường hợp kho bị thiếu Key đột xuất
            item.deliveredContent = 'Kho tạm hết Key, Admin sẽ gửi thủ công cho bạn sớm nhất!';
            allDelivered = false; 
          }
          
          await product.save(); // Khóa kho lại (lưu vào DB)

        } else if (product && product.productType === 'Service') {
          // Nếu là mua gói nâng cấp YouTube/Netflix
          item.deliveredContent = 'Hệ thống đã ghi nhận. Admin đang tiến hành nâng cấp tài khoản cho bạn!';
          allDelivered = false; // Phải chờ Admin xử lý tay
        }
      }

      // 4. Chốt trạng thái đơn hàng
      // Nếu tất cả là Key và kho đủ hàng -> Hoàn thành. Nếu có Service hoặc thiếu hàng -> Đang xử lý
      order.status = allDelivered ? 'Completed' : 'Processing';
      if (allDelivered) order.completedAt = Date.now();

      // 5. Lưu đơn hàng
      await order.save();

      // Chuyển hướng khách hàng về trang Frontend báo thành công
      // (Thay bằng URL trang web React/Vue của bạn sau này)
      res.status(200).json({ 
        message: 'Thanh toán thành công! Mã Key đã được giao trong đơn hàng.',
        order: order 
      });

    } else {
      res.status(400).json({ message: 'Khách hàng hủy thanh toán hoặc thanh toán thất bại' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi hệ thống khi giao hàng', error: error.message });
  }
};