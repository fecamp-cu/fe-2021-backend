import * as crypto from 'crypto-js';

export const createRandomSha256Text = (secret: string): string => {
  return crypto.SHA256(`${secret}${Date.now()}`).toString().substring(0, 10);
};
