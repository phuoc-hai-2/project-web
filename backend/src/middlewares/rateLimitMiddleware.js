import rateLimit from "express-rate-limit";

// Giới hạn chung: 100 req / 15 phút
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Quá nhiều yêu cầu, vui lòng thử lại sau." },
});

// Giới hạn đăng nhập/đăng ký: 20 req / 15 phút
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Quá nhiều yêu cầu xác thực, vui lòng thử lại sau." },
});

// Giới hạn reset password: 5 req / 15 phút
export const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Quá nhiều yêu cầu đặt lại mật khẩu, vui lòng thử lại sau.",
  },
});
