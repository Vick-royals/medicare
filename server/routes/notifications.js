import express from "express";
import {
  getNotifications,
  createNotification,
  markNotificationRead,
  markAllNotificationsRead,
} from "../controllers/notificationController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, getNotifications);
router.post("/", auth, createNotification);
router.put("/:id/read", auth, markNotificationRead);
router.put("/read-all", auth, markAllNotificationsRead);

export default router;
