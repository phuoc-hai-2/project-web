import crypto from "crypto";
import moment from "moment";
import qs from "qs";
import { vnpayConfig } from "../config/vnpay.js";

function sortObject(obj) {
  let sorted = {},
    str = [],
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) str.push(encodeURIComponent(key));
  }
  str.sort();
  for (key = 0; key < str.length; key++)
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  return sorted;
}

export const buildPaymentUrl = (req, amount, orderInfo, orderId) => {
  const createDate = moment().format("YYYYMMDDHHmmss");
  const ipAddr =
    req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";

  let vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: vnpayConfig.vnp_TmnCode,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: orderId,
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: "other",
    vnp_Amount: amount * 100,
    vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  vnp_Params = sortObject(vnp_Params);
  const signData = qs.stringify(vnp_Params, { encode: false });
  const signed = crypto
    .createHmac("sha512", vnpayConfig.vnp_HashSecret)
    .update(Buffer.from(signData, "utf-8"))
    .digest("hex");

  vnp_Params["vnp_SecureHash"] = signed;
  return (
    vnpayConfig.vnp_Url + "?" + qs.stringify(vnp_Params, { encode: false })
  );
};
