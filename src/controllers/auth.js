import createHttpError from 'http-errors';
import { registerUser, loginUser } from '../services/auth.js';

export const registerUserController = async (req, res, next) => {
  try {
    const newUser = await registerUser(req.body);

    if (!newUser) next(createHttpError(400, 'User registration failed'));
    res.status(201).json({
      status: 'success',
      message: 'Successfully registered a user!',
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

const createSessionTokenCookie = (res, { sessionId, refreshToken }) => {
  const day30 = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
  res.cookie('sessionId', sessionId, {
    httpOnly: true,
    expires: new Date(Date.now() + day30), // 30 days
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + day30), // 30 days
  });
};

export const loginUserController = async (req, res, next) => {
  try {
    const session = await loginUser(req.body);
    if (!session) next(createHttpError(401, 'Login failed'));
    createSessionTokenCookie(res, {
      sessionId: session._id,
      refreshToken: session.refreshToken,
    });

    console.log(session);

    res.status(200).json({
      status: 'success',
      message: 'Successfully logged in an user!',
      data: session.accessToken,
    });
  } catch (error) {
    next(createHttpError(500, error || 'An error occurred during login'));
  }
};

export const logoutUserController = (req, res) => {};
