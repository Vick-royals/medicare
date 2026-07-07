import Medication from "../models/Medication.js";

export const getMedications = async (req, res) => {
  try {
    const medications = await Medication.find({ user: req.user._id });
    res.status(200).json({ success: true, data: medications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createMedication = async (req, res) => {
  try {
    const { name, dose, instruction, frequency, route, remaining } = req.body;
    const status = remaining <= 5 ? "low" : "active";
    
    const medication = new Medication({
      user: req.user._id,
      name,
      dose,
      instruction,
      frequency,
      route,
      remaining,
      status,
    });
    
    await medication.save();
    res.status(201).json({ success: true, data: medication });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateMedication = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, dose, instruction, frequency, route, remaining, status } = req.body;
    
    let updateData = { name, dose, instruction, frequency, route, remaining, status };
    if (remaining !== undefined && remaining <= 5 && status !== "inactive") {
      updateData.status = "low";
    }
    
    const medication = await Medication.findOneAndUpdate(
      { _id: id, user: req.user._id },
      updateData,
      { new: true }
    );
    
    if (!medication) {
      return res.status(404).json({ success: false, message: "Medication not found" });
    }
    
    res.status(200).json({ success: true, data: medication });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMedication = async (req, res) => {
  try {
    const { id } = req.params;
    const medication = await Medication.findOneAndDelete({ _id: id, user: req.user._id });
    
    if (!medication) {
      return res.status(404).json({ success: false, message: "Medication not found" });
    }
    
    res.status(200).json({ success: true, message: "Medication deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
