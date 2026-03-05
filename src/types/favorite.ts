import type { Meditation } from './meditation';
import type { Video } from './culte';
import type { LectureJour } from './bible';

export interface FavoriteItem {
  type: 'meditation' | 'video' | 'lecture';
  likedAt: string;
  meditation?: Partial<Meditation>;
  video?: Partial<Video>;
  lecture?: Partial<LectureJour>;
}
