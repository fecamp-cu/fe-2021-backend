export type ServiceType = 'fecamp' | 'google' | 'facebook';

export type GoogleAuthData = {
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  id_token: string;
  expiry_date: Date;
};

export type FacebookAuthData = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

export type OAuthResponse = GoogleAuthData | FacebookAuthData;
