import * as dotenv from 'dotenv';

const envType = process.env.NODE_ENV || 'development';

dotenv.config({ path: `.env.${envType}` });

export default () => ({
  app: {
    port: parseInt(process.env.PORT) || 8000,
    url: process.env.URL,
    apiUrl: process.env.URL + '/api',
    devMode: envType === 'development',
    origin: envType === 'development' ? '*' : true,
  },
  secret: {
    policykey: process.env.CHECK_POLICIES_KEY,
    encryptionKey: process.env.ENCRYPT_KEY,
  },
  admin: {
    email: process.env.ADMIN_EMAIL,
  },
  jwt: {
    secret: process.env.SECRET,
    tokenDuration: process.env.TOKEN_DURATION || '3600s',
  },
  database: {
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT),
    name: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  },
  google: {
    credentials: {
      type: process.env.GOOGLE_CREDENTIALS_TYPE,
      project_id: process.env.GOOGLE_CREDENTIALS_PROJECT_ID,
      private_key_id: process.env.GOOGLE_CREDENTIALS_PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_CREDENTIALS_PRIVATE_KEY,
      client_email: process.env.GOOGLE_CREDENTIALS_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CREDENTIALS_CLIENT_ID,
      auth_uri: process.env.GOOGLE_CREDENTIALS_AUTH_URI,
      token_uri: process.env.GOOGLE_CREDENTIALS_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.GOOGLE_CREDENTIALS_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.GOOGLE_CREDENTIALS_CLIENT_X509_CERT_URL,
    },
    gcs: {
      serviceAccountKey: process.env.GCS_SA_KEY,
      bucketName: process.env.GCS_BUCKET_NAME,
      publicURL: process.env.GCS_PUBLIC_IMAGE_URL,
      secret: process.env.IMG_FILE_NAME_SECRET,
    },
    oauth: {
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURI: process.env.GOOGLE_OAUTH_REDIRECT_URI,
      scope: process.env.GOOGLE_OAUTH_SCOPE.split(' '),
    },
  },
  facebook: {
    appID: process.env.FACEBOOK_APP_ID,
    appSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURI: process.env.FACEBOOK_REDIRECT_URI,
    scope: process.env.FACEBOOK_SCOPE.split(' '),
  },
  omise: {
    publicKey: process.env.OMISE_PUBLIC_KEY,
    secretKey: process.env.OMISE_SECRET_KEY,
  },
  discord: {
    webhookUrl: process.env.DISCORD_WEBHOOK_URL,
  },
});
