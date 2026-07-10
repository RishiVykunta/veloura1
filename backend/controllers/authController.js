const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const asyncHandler = require('../utils/asyncHandler');
const { query } = require('../config/db');
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} = require('../validators/authValidator');
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../utils/email');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

const getFrontendUrl = () => {
  return (process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');
};

const ensurePasswordResetColumns = async () => {
  await query(`
    ALTER TABLE users
    ADD COLUMN IF NOT EXISTS reset_password_token_hash VARCHAR(255),
    ADD COLUMN IF NOT EXISTS reset_password_expires TIMESTAMP WITH TIME ZONE
  `);
};

const getValidationMessage = (validation) => {
  return validation.error?.issues?.[0]?.message || validation.error?.errors?.[0]?.message || 'Invalid request';
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  // Validate request
  const validation = registerSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400);
    throw new Error(getValidationMessage(validation));
  }

  const { firstName, lastName, email, password } = validation.data;

  // Check if user exists
  const { rows: existingUser } = await query('SELECT * FROM users WHERE email = $1', [email]);
  if (existingUser.length > 0) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const { rows: newUser } = await query(
    'INSERT INTO users (first_name, last_name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, first_name, last_name, email, role',
    [firstName, lastName, email, hashedPassword]
  );

  const user = newUser[0];

  try {
    console.log("Sending welcome email to:", user.email);
    const info = await sendWelcomeEmail({
      to: user.email,
      firstName: user.first_name,
    });
    console.log("Welcome email sent successfully:", info);
  } catch (error) {
    console.error("Welcome email failed:", error);
  }

  res.status(201).json({
    success: true,
    user: {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      role: user.role,
    },
    token: generateToken(user.id),
  });
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const validation = loginSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400);
    throw new Error(getValidationMessage(validation));
  }

  const { email, password } = validation.data;

  // Check for user
  const { rows } = await query('SELECT * FROM users WHERE email = $1', [email]);
  const user = rows[0];

  if (user && (await bcrypt.compare(password, user.password_hash))) {
    res.json({
      success: true,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user.id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Send password reset link
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const validation = forgotPasswordSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400);
    throw new Error(getValidationMessage(validation));
  }

  const { email } = validation.data;
  const { rows } = await query('SELECT id, first_name, email FROM users WHERE email = $1', [email]);
  const user = rows[0];

  if (!user) {
    return res.json({
      success: true,
      message: 'If an account exists for this email, a reset link has been sent.',
    });
  }

  await ensurePasswordResetColumns();

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenHash = hashToken(resetToken);
  const resetExpires = new Date(Date.now() + 60 * 60 * 1000);

  await query(
    'UPDATE users SET reset_password_token_hash = $1, reset_password_expires = $2 WHERE id = $3',
    [resetTokenHash, resetExpires, user.id]
  );

  const resetUrl = `${getFrontendUrl()}/reset-password/${resetToken}`;

  try {
    await sendPasswordResetEmail({
      to: user.email,
      firstName: user.first_name,
      resetUrl,
    });
  } catch (error) {
    await query(
      'UPDATE users SET reset_password_token_hash = NULL, reset_password_expires = NULL WHERE id = $1',
      [user.id]
    );
    console.error('Failed to send password reset email:', error.message);
    res.status(500);
    throw new Error('Unable to send password reset email. Please try again later.');
  }

  res.json({
    success: true,
    message: 'If an account exists for this email, a reset link has been sent.',
  });
});

// @desc    Reset password with token
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const validation = resetPasswordSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400);
    throw new Error(getValidationMessage(validation));
  }

  await ensurePasswordResetColumns();

  const { token, password } = validation.data;
  const resetTokenHash = hashToken(token);
  const { rows } = await query(
    `SELECT id FROM users
     WHERE reset_password_token_hash = $1
     AND reset_password_expires > NOW()`,
    [resetTokenHash]
  );

  const user = rows[0];
  if (!user) {
    res.status(400);
    throw new Error('Password reset link is invalid or expired');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await query(
    `UPDATE users
     SET password_hash = $1,
         reset_password_token_hash = NULL,
         reset_password_expires = NULL,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $2`,
    [hashedPassword, user.id]
  );

  res.json({
    success: true,
    message: 'Password reset successfully. You can now sign in.',
  });
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName } = req.body;
  const userId = req.user.id;

  try {
    const { rows } = await query(
      'UPDATE users SET first_name = COALESCE($1, first_name), last_name = COALESCE($2, last_name) WHERE id = $3 RETURNING id, first_name, last_name, email, role',
      [firstName, lastName, userId]
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: rows[0].id,
        firstName: rows[0].first_name,
        lastName: rows[0].last_name,
        email: rows[0].email,
        role: rows[0].role
      }
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error('Please provide both current and new password');
  }

  // Fetch user from DB to verify password
  const { rows } = await query('SELECT password_hash FROM users WHERE id = $1', [userId]);
  const user = rows[0];

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
  if (!isMatch) {
    res.status(401);
    throw new Error('Incorrect current password');
  }

  if (newPassword.length < 6) {
    res.status(400);
    throw new Error('New password must be at least 6 characters');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await query('UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [hashedPassword, userId]);

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
});

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  changePassword
};
