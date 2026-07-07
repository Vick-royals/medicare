import express from "express";
import {
  getAvailableConsultations,
  getMyConsultations,
  getPastConsultations,
  bookConsultation,
  rescheduleConsultation,
  cancelConsultation,
} from "../controllers/consultationController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/available", getAvailableConsultations);
router.get("/my", auth, getMyConsultations);
router.get("/past", auth, getPastConsultations);
router.post("/:id/book", auth, bookConsultation);
router.put("/:id/reschedule", auth, rescheduleConsultation);
router.put("/:id/cancel", auth, cancelConsultation);

export default router;
