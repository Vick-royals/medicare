import Notification from "../models/Notification.js";

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createNotification = async (req, res) => {
  try {
    const { type, title, body } = req.body;
    const notification = new Notification({
      user: req.user._id,
      type,
      title,
      body,
    });
    await notification.save();
    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { read: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }
    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { read: true }
    );
    res.status(200).json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Seed function to create initial notifications for a user
export const seedNotifications = async (userId) => {
  try {
    const count = await Notification.countDocuments({ user: userId });
    if (count > 0) {
      return;
    }
    
    const initialNotifications = [
      {
        user: userId,
        type: "reminder",
        title: "Medication Reminder",
        body: "Time to take your medications",
        read: false,
      },
      {
        user: userId,
        type: "tip",
        title: "Health Tip",
        body: "Drink plenty of water and stay active!",
        read: true,
      },
    ];
    
    await Notification.insertMany(initialNotifications);
    console.log("Initial notifications seeded successfully");
  } catch (error) {
    console.error("Error seeding notifications:", error);
  }
};
