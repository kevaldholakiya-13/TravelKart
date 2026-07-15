import { Router } from 'express';
import Joi from 'joi';
import User from '../models/User';
import { generateToken, sendSuccess, sendError, isValidEmail } from '../utils/helpers';
import { AuthRequest, protect } from '../middleware/auth';

const router = Router();

// Register
router.post('/register', async (req: AuthRequest, res) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required().min(2),
      email: Joi.string().email().required(),
      password: Joi.string().required().min(6),
      phone: Joi.string().required().pattern(/^[0-9]{10}$/),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return sendError(res, 400, error.details[0].message);
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: value.email });
    if (existingUser) {
      return sendError(res, 400, 'Email already registered');
    }

    // Create new user
    const user = new User({
      name: value.name,
      email: value.email,
      password: value.password,
      phone: value.phone,
    });

    await user.save();
    const token = generateToken(user._id.toString());

    sendSuccess(res, 201, 'User registered successfully', {
      user: user.toJSON(),
      token,
    });
  } catch (error: any) {
    sendError(res, 500, 'Registration failed', error);
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return sendError(res, 400, error.details[0].message);
    }

    // Find user
    const user = await User.findOne({ email: value.email }).select('+password');
    if (!user) {
      return sendError(res, 401, 'Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(value.password);
    if (!isPasswordValid) {
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      if (user.loginAttempts > 5) {
        user.isActive = false;
      }
      await user.save();
      return sendError(res, 401, 'Invalid credentials');
    }

    // Reset login attempts
    user.loginAttempts = 0;
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id.toString());

    sendSuccess(res, 200, 'Login successful', {
      user: user.toJSON(),
      token,
    });
  } catch (error: any) {
    sendError(res, 500, 'Login failed', error);
  }
});

// Get Current User
router.get('/me', protect, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    sendSuccess(res, 200, 'User retrieved', { user });
  } catch (error: any) {
    sendError(res, 500, 'Error retrieving user', error);
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !isValidEmail(email)) {
      return sendError(res, 400, 'Please provide a valid email');
    }

    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    // Generate reset token (in production, send via email)
    const resetToken = Math.random().toString(36).substring(2, 15);
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await user.save();

    sendSuccess(res, 200, 'Password reset link sent to email', {
      resetToken: resetToken, // In production, don't send this
    });
  } catch (error: any) {
    sendError(res, 500, 'Error processing request', error);
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const schema = Joi.object({
      token: Joi.string().required(),
      password: Joi.string().required().min(6),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return sendError(res, 400, error.details[0].message);
    }

    const user = await User.findOne({
      passwordResetToken: value.token,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      return sendError(res, 400, 'Invalid or expired reset token');
    }

    user.password = value.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    sendSuccess(res, 200, 'Password reset successful');
  } catch (error: any) {
    sendError(res, 500, 'Error resetting password', error);
  }
});

// Logout
router.post('/logout', protect, async (req, res) => {
  try {
    sendSuccess(res, 200, 'Logged out successfully');
  } catch (error: any) {
    sendError(res, 500, 'Logout failed', error);
  }
});

export default router;
