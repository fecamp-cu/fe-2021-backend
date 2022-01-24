export type RequestWithUserId = Request & {
  user: { id: number };
  cookies: {
    access_token: string;
    refresh_token: string;
  };
  csrfToken;
};

export type TokenPayload = {
  id: number;
};

export type GoogleAuthData = {
  access_token: string;
  refresh_token?: string;
  scope: string;
  token_type: string;
  id_token: string;
  expiry_date: Date;
  expires_in?: number;
};

export type FacebookAuthData = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

export type OAuthResponse = GoogleAuthData | FacebookAuthData;
