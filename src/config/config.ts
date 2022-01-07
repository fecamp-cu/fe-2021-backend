import * as dotenv from 'dotenv';

const envType = process.env.NODE_ENV || 'development';

dotenv.config({ path: `.env.${envType}` });

export default () => ({
  port: parseInt(process.env.PORT) || 8000,
  mode: process.env.NODE_ENV,
  secret: process.env.SECRET,
  tokenDuration: process.env.TOKEN_DURATION || '3600s',
  database: {
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT),
    name: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  },
  google: {
    gcs: {
      serviceAccountKey: process.env.GCS_SA_KEY,
      bucketName: process.env.GCS_BUCKET_NAME,
      publicURL: process.env.GCS_PUBLIC_IMAGE_URL,
      secret: process.env.IMG_FILE_NAME_SECRET,
    },
    oauth: {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURI: process.env.GOOGLE_REDIRECT_URI,
    },
  },
});
