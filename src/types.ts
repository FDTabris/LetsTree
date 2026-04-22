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

export type SolutionTreeNode =
  | {
      id: string;
      kind: 'species';
      speciesId: string;
    }
  | {
      id: string;
      kind: 'internal';
      children: [SolutionTreeNode, SolutionTreeNode];
    };

export interface TreeEditorNode {
  id: string;
  kind: 'species' | 'internal';
  speciesId?: string;
  childIds: string[];
  parentId: string | null;
}

export interface TreeEditorState {
  nodes: Record<string, TreeEditorNode>;
  rootIds: string[];
  nextInternalId: number;
}

export interface TreeDisplayNode {
  id: string;
  kind: 'species' | 'internal';
  speciesId?: string;
  children: TreeDisplayNode[];
  leafCount: number;
}

export interface QuizTemplate {
  id: string;
  difficulty: Difficulty;
  prompt: LocalizedText;
  explanation: LocalizedText;
  speciesIds: string[];
  solutionTree: SolutionTreeNode;
}

export interface DailyQuiz extends QuizTemplate {
  dayKey: string;
}

export interface QuizState {
  editor: TreeEditorState;
  history: TreeEditorState[];
  future: TreeEditorState[];
  revealed: boolean;
  isCorrect: boolean | null;
}
