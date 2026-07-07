import AdherenceHistory from "../models/AdherenceHistory.js";
import Medication from "../models/Medication.js";

export const getAdherenceHistory = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = { user: req.user._id };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    
    const history = await AdherenceHistory.find(query).sort({ date: 1 });
    res.status(200).json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logAdherence = async (req, res) => {
  try {
    const { medicationId, date, status } = req.body;
    const history = new AdherenceHistory({
      user: req.user._id,
      medication: medicationId,
      date: new Date(date),
      status,
    });
    await history.save();
    res.status(201).json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdherenceSummary = async (req, res) => {
  try {
    const { month, year } = req.query;
    const date = new Date(year || new Date().getFullYear(), month || new Date().getMonth(), 1);
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    const history = await AdherenceHistory.find({
      user: req.user._id,
      date: { $gte: startDate, $lte: endDate },
    });
    
    const taken = history.filter(h => h.status === "taken").length;
    const missed = history.filter(h => h.status === "missed").length;
    const snoozed = history.filter(h => h.status === "snoozed").length;
    const total = history.length || 1;
    const adherenceRate = Math.round((taken / total) * 100);
    
    res.status(200).json({
      success: true,
      data: {
        adherenceRate,
        taken,
        missed,
        snoozed,
        total,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
