import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { isDbConnected, jsonStore } from '../db/index.js';
import { JWT_SECRET } from '../config.js';

const router = express.Router();

// Register User
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, department, region } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    if (isDbConnected()) {
      const userCount = await User.countDocuments();
      if (userCount > 0) {
        return authenticate(req, res, () => {
          authorize('admin')(req, res, async () => {
            try {
              const existingUser = await User.findOne({ email });
              if (existingUser) return res.status(400).json({ message: 'User already exists' });

              const user = new User({ name, email, password, role, department, region });
              await user.save();
              const userObj = user.toObject();
              delete userObj.password;
              res.status(201).json(userObj);
            } catch (err) {
              res.status(500).json({ message: 'Error registering user', error: err.message });
            }
          });
        });
      } else {
        const user = new User({ name, email, password, role: 'admin', department, region });
        await user.save();
        const userObj = user.toObject();
        delete userObj.password;
        res.status(201).json(userObj);
      }
    } else {
      // JSON Store fallback
      const existing = jsonStore.findUserByEmail(email);
      if (existing) {
        return res.status(400).json({ message: 'User already exists' });
      }
      const count = jsonStore.countUsers();
      const userRole = count === 0 ? 'admin' : (role || 'inspector');
      const newUser = jsonStore.createUser({ name, email, password, role: userRole, department, region });
      res.status(201).json(newUser);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (isDbConnected()) {
      const user = await User.findOne({ email }).select('+password');
      if (!user) return res.status(400).json({ message: 'Invalid email or password' });

      const isMatch = await user.comparePassword(password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      const userObj = user.toObject();
      delete userObj.password;
      return res.json({ token, user: userObj });
    } else {
      // JSON Store fallback
      const user = jsonStore.findUserByEmail(email);
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      const userObj = { ...user };
      delete userObj.password;
      return res.json({ token, user: userObj });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    if (isDbConnected()) {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } else {
      const user = jsonStore.findUserById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
