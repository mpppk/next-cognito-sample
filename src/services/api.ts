import { ApiHandler } from '../models/api';
import { verifyCognitoAccessToken } from './jwt';

const verifyAccessToken = verifyCognitoAccessToken.bind(
  null,
  'ap-northeast-1',
  'ap-northeast-1_zvqoo8kSQ'
);
export const createSecuredApiHandler: <T>(
  handler: ApiHandler<T>
) => ApiHandler<T> = (handler) => {
  return async (req, res) => {
    const authorization = req.headers.authorization;
    if (authorization === undefined) {
      res.status(403).json({
        title: 'authorization token is not provided',
      });
      return;
    }

    if (!authorization.startsWith('Bearer ')) {
      res.status(403).json({
        title: 'bearer token is needed',
      });
      return;
    }

    const token = authorization.replace('Bearer ', '');

    try {
      await verifyAccessToken(token, Date.now());
    } catch (e) {
      res.status(403).json({
        title: 'invalid token',
        detail: e.message,
      });
      return;
    }

    handler(req, res);
  };
};
