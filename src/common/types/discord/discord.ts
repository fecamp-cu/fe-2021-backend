export type DiscordWebhookPayload = {
  content?: string;
  username?: string;
  avatar_url?: string;
  tts?: boolean;
  embeds?: DiscordEmbed[];
  allowed_mentions?: DiscordAllowMention;
  payload_json?: string;
  attachments?: DiscordAttachment[];
  flags?: number;
};

export type DiscordAllowMention = {
  parse?: string[];
  roles?: string[];
  users?: string[];
  replied_user?: boolean;
};

export type DiscordAttachment = {
  id: string;
  filename: string;
  description: string;
  content_type: string;
  size: number;
  url: string;
  proxy_url: string;
  height: number;
  width: number;
  ephimeral: boolean;
};

export type DiscordEmbed = {
  title?: string;
  type?: string;
  description?: string;
  url?: string;
  timestamp?: string;
  color?: number;
  footer?: DiscordEmbedFooter;
  image?: DiscordEmbedImage;
  thumbnail?: DiscordEmbedThumbnail;
  video?: DiscordEmbedVideo;
  provider?: DiscordEmbedProvider;
  author?: DiscordEmbedAuthor;
  fields?: DiscordEmbedField[];
};

export type DiscordEmbedFooter = {
  text: string;
  icon_url?: string;
  proxy_icon_url?: string;
};

export type DiscordEmbedImage = {
  url: string;
  proxy_url?: string;
  height?: number;
  width?: number;
};

export type DiscordEmbedVideo = {
  url?: string;
  proxy_url?: string;
  height?: number;
  width?: number;
};

export type DiscordEmbedThumbnail = {
  url: string;
  proxy_url?: string;
  height?: number;
  width?: number;
};

export type DiscordEmbedProvider = {
  name: string;
  url: string;
};

export type DiscordEmbedAuthor = {
  name: string;
  url?: string;
  icon_url?: string;
  proxy_icon_url?: string;
};

export type DiscordEmbedField = {
  name: string;
  value: string;
  inline?: boolean;
};
