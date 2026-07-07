import express from "express";
import {
  getAdherenceHistory,
  logAdherence,
  getAdherenceSummary,
} from "../controllers/adherenceController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, getAdherenceHistory);
router.get("/summary", auth, getAdherenceSummary);
router.post("/", auth, logAdherence);

export default router;
