import createHttpError from 'http-errors';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUserSession,
} from '../services/auth.js';

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

const createSessionTokenCookie = (res, session) => {
  const day30 = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + day30), // 30 days
  });
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + day30), // 30 days
  });
};

export const loginUserController = async (req, res, next) => {
  try {
    const session = await loginUser(req.body);
    if (!session) next(createHttpError(401, 'Login failed'));
    createSessionTokenCookie(res, session);

    res.status(200).json({
      status: 'success',
      message: 'Successfully logged in an user!',
      data: session.accessToken,
    });
  } catch (error) {
    next(createHttpError(500, error || 'An error occurred during login'));
  }
};

export const logoutUserController = async (req, res, next) => {
  try {
    console.log(req, req.cookies);
    if (req.cookies.sessionId) {
      await logoutUser(req.cookies.sessionId);
    }

    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');

    res.status(204).json();
  } catch (error) {
    next(createHttpError(500, error || 'An error occurred during logout'));
  }
};

export const refreshUserSessionController = async (req, res, next) => {
  try {
    const { sessionId, refreshToken } = req.cookies;

    const session = await refreshUserSession({ sessionId, refreshToken });

    if (!session) next(createHttpError(401, 'Session refresh failed'));

    createSessionTokenCookie(res, session);

    res.status(200).json({
      status: 'success',
      message: 'Successfully refreshed a session!',
      data: session.accessToken,
    });
  } catch (error) {
    next(
      createHttpError(500, error || 'An error occurred during session refresh')
    );
  }
};
