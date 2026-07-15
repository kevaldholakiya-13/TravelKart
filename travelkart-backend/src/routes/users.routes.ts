import { Router } from 'express';
import User from '../models/User';
import { sendSuccess, sendError } from '../utils/helpers';
import { protect, authorizeAdmin } from '../middleware/auth';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// Get User Profile
router.get('/:id', protect, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    // Check if user is accessing their own profile or admin
    if (req.userId !== req.params.id && req.user?.role !== 'admin') {
      return sendError(res, 403, 'Unauthorized');
    }

    sendSuccess(res, 200, 'User retrieved', { user });
  } catch (error: any) {
    sendError(res, 500, 'Error retrieving user', error);
  }
});

// Update User Profile
router.put('/:id', protect, async (req: AuthRequest, res) => {
  try {
    const { name, phone, address } = req.body;

    // Check authorization
    if (req.userId !== req.params.id && req.user?.role !== 'admin') {
      return sendError(res, 403, 'Unauthorized');
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    sendSuccess(res, 200, 'User updated successfully', { user });
  } catch (error: any) {
    sendError(res, 500, 'Error updating user', error);
  }
});

// Change Password
router.post('/:id/change-password', protect, async (req: AuthRequest, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return sendError(res, 400, 'Current and new password are required');
    }

    if (req.userId !== req.params.id) {
      return sendError(res, 403, 'Unauthorized');
    }

    const user = await User.findById(req.params.id).select('+password');
    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return sendError(res, 401, 'Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    sendSuccess(res, 200, 'Password changed successfully');
  } catch (error: any) {
    sendError(res, 500, 'Error changing password', error);
  }
});

// Get All Users (Admin Only)
router.get('/', protect, authorizeAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, role } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = {};
    if (role) filter.role = role;

    const users = await User.find(filter)
      .select('-password')
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(filter);

    sendSuccess(res, 200, 'Users retrieved', {
      users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    sendError(res, 500, 'Error retrieving users', error);
  }
});

// Delete User (Admin Only)
router.delete('/:id', protect, authorizeAdmin, async (req: AuthRequest, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    sendSuccess(res, 200, 'User deleted successfully');
  } catch (error: any) {
    sendError(res, 500, 'Error deleting user', error);
  }
});

export default router;
