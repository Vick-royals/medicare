import Consultation from "../models/Consultation.js";

export const getAvailableConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find({ status: "Available" });
    res.status(200).json({ success: true, data: consultations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find({ 
      user: req.user._id, 
      status: { $in: ["Confirmed"] } 
    });
    res.status(200).json({ success: true, data: consultations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPastConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find({ 
      user: req.user._id, 
      status: { $in: ["Completed", "Cancelled"] } 
    });
    res.status(200).json({ success: true, data: consultations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const bookConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    const consultation = await Consultation.findById(id);
    
    if (!consultation || consultation.status !== "Available" || consultation.slots <= 0) {
      return res.status(400).json({ success: false, message: "Consultation not available" });
    }
    
    // Create a booked appointment for the user
    const bookedConsultation = new Consultation({
      ...consultation.toObject(),
      _id: undefined,
      user: req.user._id,
      status: "Confirmed",
      slots: undefined,
    });
    
    await bookedConsultation.save();
    
    // Update the original consultation's slots
    consultation.slots -= 1;
    if (consultation.slots <= 0) {
      consultation.status = "Completed";
    }
    await consultation.save();
    
    res.status(201).json({ success: true, data: bookedConsultation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const rescheduleConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time } = req.body;
    
    const consultation = await Consultation.findOneAndUpdate(
      { _id: id, user: req.user._id, status: "Confirmed" },
      { date, time },
      { new: true }
    );
    
    if (!consultation) {
      return res.status(404).json({ success: false, message: "Consultation not found" });
    }
    
    res.status(200).json({ success: true, data: consultation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    const consultation = await Consultation.findOneAndUpdate(
      { _id: id, user: req.user._id, status: "Confirmed" },
      { status: "Cancelled", statusColor: "bg-red-100 text-red-700" },
      { new: true }
    );
    
    if (!consultation) {
      return res.status(404).json({ success: false, message: "Consultation not found" });
    }
    
    res.status(200).json({ success: true, data: consultation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Seed function to create initial available consultations
export const seedConsultations = async () => {
  try {
    const count = await Consultation.countDocuments({ status: "Available" });
    if (count > 0) {
      return;
    }
    
    const initialConsultations = [
      {
        name: "General Checkup",
        doctor: "Dr. Sarah Johnson",
        specialty: "General Physician",
        date: new Date("2026-06-10"),
        time: "10:00 AM",
        location: "Neutral Nexus Medical Center",
        slots: 12,
        type: "Physical Visit",
        typeColor: "bg-blue-100 text-blue-700",
        avatar: "https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1",
      },
      {
        name: "Cardiology Consultation",
        doctor: "Dr. Michael Lee",
        specialty: "Cardiologist",
        date: new Date("2026-06-12"),
        time: "03:00 PM",
        location: "Virtual Consultation",
        slots: 8,
        type: "Virtual Visit",
        typeColor: "bg-teal-100 text-teal-700",
        avatar: "https://images.pexels.com/photos/5452268/pexels-photo-5452268.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1",
      },
      {
        name: "Diabetes Follow-up",
        doctor: "Dr. Emily Davis",
        specialty: "Endocrinologist",
        date: new Date("2026-06-14"),
        time: "11:30 AM",
        location: "Neutral Nexus Medical Center",
        slots: 10,
        type: "Physical Visit",
        typeColor: "bg-blue-100 text-blue-700",
        avatar: "https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1",
      },
    ];
    
    await Consultation.insertMany(initialConsultations);
    console.log("Initial consultations seeded successfully");
  } catch (error) {
    console.error("Error seeding consultations:", error);
  }
};
