// Collections
import UsersCollection from '../db/models/user.js';
import SessionCollection from '../db/models/session.js';
// Node modules
import createHttpError from 'http-errors';
import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';

// Utils
import { env } from '../utils/env.js';
import sendMail from '../utils/sendMail.js';

// Constants
import { SMTP, TEMPLATE_DIR } from '../constants/index.js';

export const registerUser = async (payload) => {
  const user = await UsersCollection.findOne({
    email: payload.email,
  });

  if (user) throw createHttpError(409, 'Email in use');

  const hashedPassword = await bcrypt.hash(payload.password, 10);
  payload.password = hashedPassword;

  return await UsersCollection.create(payload);
};

// Login user
export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({
    email: payload.email,
  });
  if (!user) throw createHttpError(401, 'User not found');

  const isPasswordValid = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordValid) throw createHttpError(401, 'User password is wrong');

  await SessionCollection.deleteOne({ userId: user._id });
  const tokens = createSessionTokens();

  return await SessionCollection.create({
    userId: user._id,
    ...tokens,
  });
};

export const logoutUser = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

const createSessionTokens = () => {
  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');

  const accessTokenValidUntil = new Date(new Date().getTime() + 15 * 60 * 1000); // 15 minutes
  const refreshTokenValidUntil = new Date(
    new Date().getTime() + 30 * 24 * 60 * 60 * 1000
  ); // 30 days

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};

// Refresh user sessions
export const refreshUserSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) throw createHttpError(401, 'Session not found');

  const isSessionRefreshTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionRefreshTokenExpired) {
    throw createHttpError(401, 'Session refresh token expired');
  }

  await SessionCollection.deleteOne({ _id: session._id });
  const newToken = createSessionTokens();

  return await SessionCollection.create({
    userId: session.userId,
    ...newToken,
  });
};

export const sendResetEmail = async (email) => {
  const user = await UsersCollection.findOne({
    email,
  });
  if (!user) throw createHttpError(404, 'User not found');
  const resetToken = jwt.sign(
    {
      email: user.email,
    },
    env('JWT_SECRET'),
    {
      expiresIn: '5m',
    }
  );

  const resetEmailTemplateSource = await fs.readFile(
    path.join(TEMPLATE_DIR, 'reset-password-email.html'),
    'utf-8'
  );

  if (!resetEmailTemplateSource)
    throw createHttpError(500, 'Email template not found');

  const resetEmailTemplate = handlebars.compile(resetEmailTemplateSource);
  const html = resetEmailTemplate({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });
  await sendMail({
    from: env(SMTP.SMTP_FROM),
    to: user.email,
    subject: 'Reset your password',
    html,
  });
};

export const resetPassword = async (token, password) => {
  let entries;
  try {
    entries = jwt.verify(token, env('JWT_SECRET'));
  } catch (error) {
    throw createHttpError(401, error || 'Token is expired or invalid.');
  }

  const user = await UsersCollection.findOne({
    email: entries.email,
  });

  if (!user) throw createHttpError(404, 'User not found');

  const encryptedPassword = await bcrypt.hash(password, 10);

  await UsersCollection.updateOne(
    { _id: user._id },
    {
      password: encryptedPassword,
    }
  );

  await SessionCollection.deleteMany({
    userId: user._id,
  });
};
