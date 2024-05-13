import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { checkUsername, createUser } from '../database.js';

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
    console.log(checkedUsername);

    if (checkedUsername) {
      return res.status(409).json({ message: 'Username is already taken!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await createUser(username, email, hashedPassword, role);

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
    console.log(user);

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
      .json(userInfo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to login!' });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token').status(200).json({ message: 'Logout Successful' });
};
