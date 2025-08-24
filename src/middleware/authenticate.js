import createHttpError from 'http-errors';

import UsersCollection from '../db/models/user.js';
import SessionCollection from '../db/models/session.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) next(createHttpError(401, 'Authorization header missing'));

  console.log(authHeader);

  const bearer = authHeader.split(' ')[0];
  if (bearer !== 'Bearer')
    next(createHttpError(401, 'Invalid authorization header format'));
  const token = authHeader.split(' ')[1];
  if (!token)
    next(createHttpError(401, 'Token missing in authorization header'));

  const session = await SessionCollection.findOne({ accessToken: token });
  if (!session) next(createHttpError(401, 'Session not found'));

  const isAccessTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);
  if (isAccessTokenExpired) next(createHttpError(401, 'Access token expired'));

  const user = await UsersCollection.findOne({ _id: session.userId });
  if (!user) next(createHttpError(401, 'User not found for this session'));

  req.user = user;

  next();
};
