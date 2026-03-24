import express from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { apiLimiter } from "./middlewares/rateLimitMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());

// Rate limiter toàn bộ API
app.use("/api", apiLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api", categoryRoutes);
app.use("/api/admin", adminRoutes);

const __dirname = path.resolve();
app.use("/images", express.static(path.join(__dirname, "/images")));
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

export default app;
