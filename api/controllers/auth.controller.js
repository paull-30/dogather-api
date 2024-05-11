import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../mongoose/schema.js';

export const register = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  let role = req.body.role;

  if (role === 'admin') {
    return res.status(404).json({ message: "You can't have this role!" });
  }

  if (password !== confirmPassword)
    return res.status(400).json({ message: 'Passwords do not match!' });

  if (!role) {
    role = 'VOLUNTEER';
  }

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(409).json({ message: 'Username is already taken!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to create user!' });
  }
};
