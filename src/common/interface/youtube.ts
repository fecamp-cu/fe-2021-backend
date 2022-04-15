export interface YoutubeVideo {
  kind: string;
  etag: string;
  id: string;
  items: YoutubeItem[];
}

export interface YoutubeItem {
  kind: string;
  etag: string;
  snippet: YoutubeSnippet;
  contentDetails: YoutuebContentDetail;
  statistics: YoutubeStatistics;
}
export interface YoutubeSnippet {
  publishedAt: Date;
  channelId: string;
  title: string;
  description: string;
  thumbnails: YoutubeThumbnail;
  channelTitle: string;
  tags: string[];
  categoryId: string;
  liveBroadcastContent: string;
  defaultLanguage: string;
  localized: YoutubeLocalized;
  defaultAudioLanguage: string;
}

export interface YoutubeLocalized {
  title: string;
  description: string;
}

export interface YoutubeThumbnailDetails {
  url: string;
  width: number;
  height: number;
}

export interface YoutubeThumbnail {
  default: YoutubeThumbnailDetails;
  medium: YoutubeThumbnailDetails;
  high: YoutubeThumbnailDetails;
  standard: YoutubeThumbnailDetails;
  maxres: YoutubeThumbnailDetails;
}

export interface YoutuebContentDetail {
  duration: string;
  dimension: string;
  definition: string;
  caption: string;
  licensedContent: boolean;
  contentRating: unknown;
  projection: string;
}

export interface YoutubeStatistics {
  viewCount: string;
  likeCount: string;
  favoriteCount: string;
  commentCount: string;
}

export interface Youtube {
  url: string;
  title?: string;
  views?: string;
  likes?: string;
  thumbnail?: string;
  duration?: string;
  publishDate?: Date;
}
