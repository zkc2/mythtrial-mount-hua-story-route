export type Language = 'zh' | 'en';

export interface StampData {
  id: string;
  name: string;
  nameEn: string;
  sealCharacters: string;
  sealCharactersZh: string;
  motif: string;
  motifEn: string;
  description: string;
  descriptionEn: string;
  colorHex: string;
  sealShape: 'square' | 'circle' | 'octagon';
  iconType: 'lotus' | 'temple' | 'sword' | 'cloud' | 'axe' | 'lantern';
}

export interface Checkpoint {
  id: number;
  location: string;
  locationEn: string;
  subLocation?: string;
  subLocationEn?: string;
  altitude: string;
  stage: string;
  stageEn: string;
  chapterTitle: string;
  chapterTitleEn: string;
  summary: string;
  summaryEn: string;
  storyNarrative: string;
  storyNarrativeEn: string;
  classicalVerse: string;
  classicalVerseEn: string;
  heritageFact: string;
  heritageFactEn: string;
  reflectionQuestion: string;
  reflectionQuestionEn: string;
  coordinates: {
    mapX: number; // percentage 0-100 on map canvas
    mapY: number;
    elevationLevel: number; // 1 to 6
  };
  stamp: StampData;
}

export type ActiveScreen = 'welcome' | 'map' | 'story' | 'stamps' | 'archive' | 'qr' | 'case-study';

export interface UserProgress {
  completedCheckpoints: number[];
  collectedStamps: string[];
  currentCheckpointId: number;
  unlockedCheckpoints: number[];
  freeExploreMode: boolean;
  audioMuted: boolean;
  userName?: string;
}
