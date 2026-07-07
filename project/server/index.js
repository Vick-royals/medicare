import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import medicationRoutes from "./routes/medications.js";
import consultationRoutes from "./routes/consultations.js";
import notificationRoutes from "./routes/notifications.js";
import adherenceRoutes from "./routes/adherence.js";
import { seedConsultations } from "./controllers/consultationController.js";

const app = express();

connectDB().then(async () => {
  await seedConsultations();
});

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/medications", medicationRoutes);
app.use("/api/consultations", consultationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/adherence", adherenceRoutes);

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is in use, trying port ${parseInt(PORT) + 1}...`);
    server.close();
    const newPort = parseInt(PORT) + 1;
    app.listen(newPort, () => console.log(`Server running on http://localhost:${newPort}`));
  }
});
