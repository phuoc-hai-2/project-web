import dotenv from "dotenv";
dotenv.config();

export const vnpayConfig = {
  vnp_TmnCode: process.env.VNP_TMN_CODE || "TEST_TMN_CODE",
  vnp_HashSecret:
    process.env.VNP_HASH_SECRET || "TEST_SECRET_KEY_1234567890_ABCDEF",
  vnp_Url:
    process.env.VNP_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  vnp_Api:
    process.env.VNP_API ||
    "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction",
  vnp_ReturnUrl:
    process.env.VNP_RETURN_URL ||
    "http://localhost:5000/api/payments/vnpay_return",
};
