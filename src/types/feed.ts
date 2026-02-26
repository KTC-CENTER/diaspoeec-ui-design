export type FeedItemType = 'meditation' | 'evenement' | 'anniversaire' | 'campagne' | 'live' | 'lecture';

export interface FeedItem {
  id: string;
  type: FeedItemType;
  data: Record<string, unknown>;
  createdAt: string;
}
