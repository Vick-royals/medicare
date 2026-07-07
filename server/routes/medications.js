import express from "express";
import { getMedications, createMedication, updateMedication, deleteMedication } from "../controllers/medicationController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, getMedications);
router.post("/", auth, createMedication);
router.put("/:id", auth, updateMedication);
router.delete("/:id", auth, deleteMedication);

export default router;
