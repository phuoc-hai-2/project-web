import nodemailer from "nodemailer";

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER || "",
      pass: process.env.EMAIL_PASS || "",
    },
  });

export const sendOrderConfirmationEmail = async (order, userEmail) => {
  if (!process.env.EMAIL_USER) return;
  try {
    const transporter = createTransporter();
    const itemsList = order.orderItems
      .map(
        (item) =>
          `<tr><td>${item.name}</td><td>${item.qty}</td><td>${item.price.toLocaleString()} VND</td></tr>`,
      )
      .join("");
    await transporter.sendMail({
      from: `"Digital Store" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Xác nhận đơn hàng #${order._id}`,
      html: `<h2>Cảm ơn bạn đã đặt hàng!</h2><p>Đơn hàng <strong>#${order._id}</strong> đã được ghi nhận.</p><table border="1" cellpadding="8" style="border-collapse:collapse"><thead><tr><th>Sản phẩm</th><th>Số lượng</th><th>Giá</th></tr></thead><tbody>${itemsList}</tbody></table><p><strong>Tổng tiền: ${order.totalPrice.toLocaleString()} VND</strong></p>`,
    });
  } catch (error) {
    console.error("Email error:", error.message);
  }
};

export const sendKeyDeliveryEmail = async (order, userEmail) => {
  if (!process.env.EMAIL_USER) return;
  try {
    const transporter = createTransporter();
    const keysList = order.orderItems
      .map(
        (item) =>
          `<p><strong>${item.name}:</strong> ${item.deliveredContent || "Đang xử lý"}</p>`,
      )
      .join("");
    await transporter.sendMail({
      from: `"Digital Store" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Đơn hàng #${order._id} - Mã Key của bạn`,
      html: `<h2>Đơn hàng đã hoàn thành!</h2>${keysList}<p>Cảm ơn bạn đã tin tưởng Digital Store!</p>`,
    });
  } catch (error) {
    console.error("Email error:", error.message);
  }
};

export const sendPasswordResetEmail = async (email, resetToken) => {
  if (!process.env.EMAIL_USER) return;
  try {
    const transporter = createTransporter();
    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${resetToken}`;
    await transporter.sendMail({
      from: `"Digital Store" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Đặt lại mật khẩu",
      html: `<h2>Yêu cầu đặt lại mật khẩu</h2><p>Link có hiệu lực 10 phút:</p><a href="${resetUrl}" style="background:#007bff;color:white;padding:10px 20px;text-decoration:none;border-radius:5px">Đặt lại mật khẩu</a>`,
    });
  } catch (error) {
    console.error("Email error:", error.message);
  }
};

export const sendRefundEmail = async (order, userEmail) => {
  if (!process.env.EMAIL_USER) return;
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Digital Store" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Hoàn tiền đơn hàng #${order._id}`,
      html: `<h2>Thông báo hoàn tiền</h2><p>Đơn hàng <strong>#${order._id}</strong> đã được hoàn tiền.</p><p>Số tiền: <strong>${order.totalPrice.toLocaleString()} VND</strong></p>`,
    });
  } catch (error) {
    console.error("Email error:", error.message);
  }
};
