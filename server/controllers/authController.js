import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import Medication from '../models/Medication.js';
import { seedNotifications } from './notificationController.js';

const seedMedications = async (userId) => {
  try {
    const count = await Medication.countDocuments({ user: userId });
    if (count > 0) {
      return;
    }
    
    const initialMedications = [
      {
        user: userId,
        name: "Paracetamol 500mg",
        dose: "1 tablet",
        instruction: "After food",
        frequency: "2x Daily",
        route: "Oral",
        remaining: 30,
        status: "active",
        color: "bg-blue-100",
        pillColor: "text-blue-500",
      },
      {
        user: userId,
        name: "Vitamin C 500mg",
        dose: "1 tablet",
        instruction: "After food",
        frequency: "1x Daily",
        route: "Oral",
        remaining: 15,
        status: "active",
        color: "bg-green-100",
        pillColor: "text-green-500",
      },
      {
        user: userId,
        name: "Metformin 500mg",
        dose: "1 tablet",
        instruction: "With food",
        frequency: "2x Daily",
        route: "Oral",
        remaining: 3,
        status: "low",
        color: "bg-orange-100",
        pillColor: "text-orange-500",
      },
      {
        user: userId,
        name: "Atorvastatin 20mg",
        dose: "1 tablet",
        instruction: "After food",
        frequency: "1x Daily",
        route: "Oral",
        remaining: 20,
        status: "active",
        color: "bg-purple-100",
        pillColor: "text-purple-500",
      },
    ];
    
    await Medication.insertMany(initialMedications);
    console.log("Initial medications seeded successfully");
  } catch (error) {
    console.error("Error seeding medications:", error);
  }
};

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

export const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const errors = {};

    if (!name || name.trim().length < 2) {
      errors.name = 'Full name must be at least 2 characters';
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!password) {
      errors.password = 'Password is required';
    } else {
      if (password.length < 8) errors.password = 'Password must be at least 8 characters';
      else if (!/[A-Z]/.test(password)) errors.password = 'Password must contain at least one uppercase letter';
      else if (!/[a-z]/.test(password)) errors.password = 'Password must contain at least one lowercase letter';
      else if (!/[0-9]/.test(password)) errors.password = 'Password must contain at least one number';
      else if (!/[^A-Za-z0-9]/.test(password)) errors.password = 'Password must contain at least one special character';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(422).json({ success: false, errors });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({
        success: false,
        errors: { email: 'An account with this email already exists' },
      });
    }

    const user = await User.create({ name: name.trim(), email: email.toLowerCase().trim(), phone: phone?.trim() || null, password });
    const token = generateToken(user._id);
    
    // Seed initial data for the new user
    await seedMedications(user._id);
    await seedNotifications(user._id);

    res.status(201).json({ success: true, token, user: user.toSafeObject() });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const errors = {};
    if (!email) errors.email = 'Email is required';
    if (!password) errors.password = 'Password is required';

    if (Object.keys(errors).length > 0) {
      return res.status(422).json({ success: false, errors });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        errors: { email: 'No account found with this email address' },
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        errors: { password: 'Incorrect password' },
      });
    }

    const token = generateToken(user._id);
    res.json({ success: true, token, user: user.toSafeObject() });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(422).json({ success: false, errors: { email: 'Email is required' } });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({ success: true, message: 'If that email is registered, a reset link has been sent.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save({ validateModifiedOnly: true });

    // TODO: send email with reset link containing token (e.g., using nodemailer or similar service)
    // For security, we no longer log the token to the console

    res.json({ success: true, message: 'If that email is registered, a reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const errors = {};

    if (!token) {
      errors.token = 'Reset token is required';
    }
    if (!password) {
      errors.password = 'New password is required';
    } else {
      if (password.length < 8) errors.password = 'Password must be at least 8 characters';
      else if (!/[A-Z]/.test(password)) errors.password = 'Password must contain at least one uppercase letter';
      else if (!/[a-z]/.test(password)) errors.password = 'Password must contain at least one lowercase letter';
      else if (!/[0-9]/.test(password)) errors.password = 'Password must contain at least one number';
      else if (!/[^A-Za-z0-9]/.test(password)) errors.password = 'Password must contain at least one special character';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(422).json({ success: false, errors });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    const jwtToken = generateToken(user._id);
    res.json({ success: true, token: jwtToken, user: user.toSafeObject() });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};
