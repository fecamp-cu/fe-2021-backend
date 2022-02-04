export enum EmailMessage {
  VERIFY_SUBJECT = 'Welcome to our FE Camp Family',
  VERYFY_MESSAGE = 'the next step is you need to verify your email address.',
  RESET_PASSWORD_SUBJECT = 'Reset Password',
  ACCOUNT_PASSWORD_SUBJECT = 'Welcome our FE Camp Family',
}

export enum Discord {
  DEFAULT_USERNAME = 'FE Camp Notification',
  DEFAULT_AVATAR_URL = 'https://storage.googleapis.com/fe-camp/Fe-camp-Logo.png',
  DEFAULT_TOPIC = 'Hello World',
  DEFAULT_MESSAGE = 'Hello, this is a test message.',
  DEFAULT_COLOR = 0x292929,

  SHOP_USERNAME = 'FE Camp Shop',
  SHOP_AVATAR_URL = 'https://storage.googleapis.com/fe-camp/FE-Camp-Shop-Icon.png',
  SHOP_TITLE_SOLD = 'Sold',
  SHOP_COLOR = 0x0099ff,

  CUSTOMER_ANOYMOUS_AVATAR_URL = 'https://storage.googleapis.com/fe-camp/Annonymous-Icon.png',

  ALERT_USERNAME = 'FE Alert',
  ALERT_AVATAR_URL = 'https://storage.googleapis.com/fe-camp/FE-Camp-Alerting-Icon.png',
  ALERT_COLOR = 0xff2b5e,

  OMISE_USERNAME = 'Omise',
  OMISE_AVATAR = 'https://storage.googleapis.com/fe-camp/Omise-Icon.jpg',
  OMISE_URL = 'https://www.omise.co/',

  NO_CONTENT = '',
  TAG_ADMIN = '<@&906181495356538921>',
}

export enum DiscordMentionType {
  ROLE = 'role',
  USER = 'user',
  EVERYONE = 'everyone',
}

export enum DiscordEmbedType {
  RICH = 'rich',
  IMAGE = 'image',
  VIDEO = 'video',
  GIFV = 'gifv',
  ARTICLE = 'article',
  LINK = 'link',
}
