import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import {
  checkEmail,
  checkUsername,
  createUser,
  getSkills,
} from '../services/user.queries.js';

export const register = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  let role = req.body.role || 'VOLUNTEER';

  if (role === 'admin') {
    return res.status(404).json({ message: "You can't have this role!" });
  }

  if (password !== confirmPassword)
    return res.status(400).json({ message: 'Passwords do not match!' });

  try {
    const checkedUsername = await checkUsername(username);

    if (checkedUsername) {
      return res.status(409).json({ message: 'Username is already taken!' });
    }

    const checkedEmail = await checkEmail(email);
    if (checkedEmail) {
      return res.status(409).json({ message: 'Email already registered!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    await createUser(userId, username, email, hashedPassword, role);

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to create user!' });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await checkUsername(username);
    const { skills } = await getSkills(user.id);

    if (!user) return res.status(400).json({ message: 'Invalid Credentials!' });

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.status(400).json({ message: 'Invalid Credentials!' });

    const age = 1000 * 60 * 60 * 24 * 7;

    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age }
    );
    const { password: userPassword, ...userInfo } = user;

    res
      .cookie('token', token, {
        httpOnly: true,
        // secure:true,
        maxAge: age,
      })
      .status(200)
      .json({ ...userInfo, skills });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to login!' });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token').status(200).json({ message: 'Logout Successful' });
};
