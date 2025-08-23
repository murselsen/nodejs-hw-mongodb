// Collections
import UsersCollection from '../db/models/user.js';
import SessionCollection from '../db/models/session.js';

import bcrypt from 'bcrypt';
import crypto from 'crypto';
import createHttpError from 'http-errors';

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
