export type Locale = 'en' | 'zhHans';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface LocalizedText {
  en: string;
  zhHans: string;
}

export interface Species {
  id: string;
  names: LocalizedText;
  photoUrl: string;
  clade: string;
}

export interface LayoutNode {
  id: string;
  kind: 'branch' | 'slot';
  children?: LayoutNode[];
  slotId?: string;
}

export interface TreeTopologyOption {
  id: string;
  label: LocalizedText;
  layout: LayoutNode;
}

export interface QuizTemplate {
  id: string;
  difficulty: Difficulty;
  prompt: LocalizedText;
  explanation: LocalizedText;
  layout: LayoutNode;
  correctPlacements: Record<string, string>;
  topologyChoices?: TreeTopologyOption[];
  requiredTopologyChoice?: boolean;
  correctTopologyId?: string;
}

export interface DailyQuiz extends QuizTemplate {
  dayKey: string;
  speciesIds: string[];
}

export interface QuizState {
  placements: Record<string, string | null>;
  revealed: boolean;
  isCorrect: boolean | null;
  selectedTopologyId: string | null;
}
