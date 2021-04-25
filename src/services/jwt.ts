import jwkToBuffer from 'jwk-to-pem';
import jwt from 'jsonwebtoken';

type CognitoJWK = jwkToBuffer.JWK & {
  kid: string;
  use: string;
};

// Refer https://tools.ietf.org/html/rfc7519#section-4.1
interface RegisteredClaim {
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  nbf: number;
  iat: number;
  jti: string;
}

export interface CognitoAccessTokenPayload
  extends Omit<RegisteredClaim, 'aud'> {
  event_id: string;
  token_use: 'access';
  scope: string;
  auth_time: number;
  client_id: string;
  username: string;
}

interface UnVerifiedCognitoAccessTokenPayload
  extends Omit<CognitoAccessTokenPayload, 'token_use'> {
  token_use: 'id' | 'access';
}

export const verifyCognitoAccessToken = async (
  region: string,
  poolID: string,
  accessToken: string,
  currentUnixTime: number
): Promise<CognitoAccessTokenPayload> => {
  const unverifiedToken = ((await verifyCognitoJwt(
    region,
    poolID,
    accessToken
  )) as unknown) as UnVerifiedCognitoAccessTokenPayload;
  if (unverifiedToken.exp <= currentUnixTime / 1000) {
    throw new Error(
      `access token is expired. current: ${currentUnixTime}, exp: ${unverifiedToken.exp}`
    );
  }

  const iss = buildCognitoIssuerURL(region, poolID);
  if (unverifiedToken.iss !== iss) {
    throw new Error(
      `invalid issuer. expect: ${iss}, got: ${unverifiedToken.iss}`
    );
  }

  if (unverifiedToken.token_use !== 'access') {
    throw new Error(
      'invalid token_use. expect: access, got: ' + unverifiedToken.token_use
    );
  }

  return unverifiedToken as CognitoAccessTokenPayload;
};

const verifyCognitoJwt = async (
  region: string,
  poolID: string,
  token: string
): Promise<Record<string, unknown> | undefined> => {
  const untrustedDecodedJwt = jwt.decode(token, { complete: true });
  if (untrustedDecodedJwt === null) {
    throw Error('failed to decode jwt');
  }

  const { kid, alg } = untrustedDecodedJwt.header;
  const jwks = await fetchJwks(region, poolID);
  const jwk = jwks.find((jwk) => jwk.kid === kid);
  if (jwk === undefined) {
    throw Error('JWK which have kid ' + kid + ' not found');
  }
  const pem = jwkToBuffer(jwk);
  return new Promise((resolve, reject) => {
    jwt.verify(token, pem, { algorithms: [alg] }, function (err, decodedToken) {
      if (err !== null) {
        reject(err);
        return;
      }
      resolve(decodedToken as Record<string, unknown> | undefined);
    });
  });
};

const buildCognitoIssuerURL = (region: string, poolID: string) =>
  `https://cognito-idp.${region}.amazonaws.com/${poolID}`;
const buildCognitoJwkURL = (region: string, poolID: string): string =>
  buildCognitoIssuerURL(region, poolID) + '/.well-known/jwks.json';

const fetchJwks = async (
  region: string,
  poolID: string
): Promise<CognitoJWK[]> => {
  const jwkUrl = buildCognitoJwkURL(region, poolID);
  const res = await fetch(jwkUrl);
  const json = await res.json();
  return json.keys;
};
