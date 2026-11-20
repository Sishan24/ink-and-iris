import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { emailService } from '../services/emailService.js';
import { AuthRequest } from '../middleware/auth.js';

export const authController = {
  // Step 1: Request OTP or initiate login
  async requestOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email) {
        res.status(400).json({ message: 'Email address is required.' });
        return;
      }

      const user = await User.findOne({ email: email.toLowerCase().trim() });
      if (!user) {
        res.status(401).json({ message: 'Author account not found with this email.' });
        return;
      }

      if (password) {
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
          res.status(401).json({ message: 'Invalid credentials provided.' });
          return;
        }
      }

      // Generate 6-digit OTP code
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

      user.otpCode = otp;
      user.otpExpiresAt = expiresAt;
      await user.save();

      await emailService.sendOtpEmail(user.email, otp);

      res.status(200).json({
        success: true,
        message: 'Security verification code dispatched.',
        expiresAt,
        // In local dev, we also provide the OTP in response for instant testing convenience
        devOtp: process.env.NODE_ENV === 'development' ? otp : undefined
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message || 'Error requesting security code.' });
    }
  },

  // Step 2: Verify OTP and grant token
  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) {
        res.status(400).json({ message: 'Email and verification code are required.' });
        return;
      }

      const user = await User.findOne({ email: email.toLowerCase().trim() });
      if (!user) {
        res.status(401).json({ message: 'Author account not found.' });
        return;
      }

      if (!user.otpCode || user.otpCode !== otp.trim()) {
        res.status(400).json({ message: 'Incorrect verification code.' });
        return;
      }

      if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
        res.status(400).json({ message: 'Verification code has expired. Please request a new one.' });
        return;
      }

      // Clear used OTP
      user.otpCode = undefined;
      user.otpExpiresAt = undefined;
      await user.save();

      const secret = process.env.JWT_SECRET || 'ink_and_iris_default_secret_key';
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        secret,
        { expiresIn: '7d' }
      );

      res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl
        }
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message || 'Error verifying code.' });
    }
  },

  // Direct login with password for author convenience
  async loginDirect(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required.' });
        return;
      }

      const user = await User.findOne({ email: email.toLowerCase().trim() });
      if (!user) {
        res.status(401).json({ message: 'Invalid credentials.' });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        res.status(401).json({ message: 'Invalid credentials.' });
        return;
      }

      const secret = process.env.JWT_SECRET || 'ink_and_iris_default_secret_key';
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        secret,
        { expiresIn: '7d' }
      );

      res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl
        }
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message || 'Login failed.' });
    }
  },

  async getMe(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated.' });
      return;
    }
    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        avatarUrl: req.user.avatarUrl
      }
    });
  },

  async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Not authenticated.' });
        return;
      }

      const { name, avatarUrl, currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user._id);
      if (!user) {
        res.status(404).json({ message: 'User not found.' });
        return;
      }

      if (name) user.name = name.trim();
      if (avatarUrl) user.avatarUrl = avatarUrl;

      if (newPassword) {
        if (!currentPassword) {
          res.status(400).json({ message: 'Current password required to change password.' });
          return;
        }
        const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isMatch) {
          res.status(400).json({ message: 'Current password does not match.' });
          return;
        }
        user.passwordHash = await bcrypt.hash(newPassword, 10);
      }

      await user.save();
      res.status(200).json({
        success: true,
        message: 'Author profile updated successfully.',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl
        }
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message || 'Error updating profile.' });
    }
  }
};
