export type ServiceType = 'fecamp' | 'google' | 'facebook';

export type OAuthResponse = {
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  id_token: string;
  expire_date: Date;
};
