import { useEffect, useMemo, useState } from 'react';
import {
  buildDailyQuizzes,
  buildEditorForest,
  buildInitialQuizStates,
  buildSolutionDisplayTree,
  cloneEditorState,
  createInitialEditorState,
  deserializeState,
  evaluateEditorTree,
  formatDayKey,
  getSpecies,
  groupNodes,
  isEditorComplete,
  localStorageKeys,
  msUntilNextLocalMidnight,
  serializeState,
  toLocaleText,
} from './game';
import { Locale, QuizState, TreeDisplayNode, TreeEditorState } from './types';
import { TreeView } from './treeRenderer';

type StoredState = {
  dayKey: string;
  currentQuizIndex: number;
  quizStates: QuizState[];
  locale: Locale;
};

const localeLabels: Record<Locale, string> = {
  en: 'English',
  zhHans: '简体中文',
};

const defaultLocale = (): Locale => {
  const browser = navigator.language.toLowerCase();
  return browser.startsWith('zh') ? 'zhHans' : 'en';
};

const loadLocale = (): Locale => {
  const stored = window.localStorage.getItem(localStorageKeys.locale);
  return stored === 'zhHans' ? 'zhHans' : stored === 'en' ? 'en' : defaultLocale();
};

const saveLocale = (locale: Locale) => {
  window.localStorage.setItem(localStorageKeys.locale, locale);
};

const isStoredState = (value: StoredState | null): value is StoredState =>
  Boolean(
    value &&
      Array.isArray(value.quizStates) &&
      typeof value.currentQuizIndex === 'number' &&
      (value.locale === 'en' || value.locale === 'zhHans') &&
      value.quizStates.every(
        (state) =>
          state &&
          typeof state.revealed === 'boolean' &&
          Array.isArray(state.history) &&
          Array.isArray(state.future) &&
          Boolean(state.editor) &&
          Array.isArray(state.editor.rootIds) &&
          typeof state.editor.nextInternalId === 'number' &&
          typeof state.editor.nodes === 'object',
      ),
  );

const loadStoredState = (dayKey: string): StoredState | null => {
  const parsed = deserializeState<StoredState>(window.localStorage.getItem(localStorageKeys.state));
  if (!isStoredState(parsed) || parsed.dayKey !== dayKey) return null;
  return parsed;
};

const saveStoredState = (state: StoredState) => {
  window.localStorage.setItem(localStorageKeys.state, serializeState(state));
};

const describeTree = (tree: TreeDisplayNode, locale: Locale): string => {
  if (tree.kind === 'species' && tree.speciesId) {
    const species = getSpecies(tree.speciesId);
    return species ? toLocaleText(species.names, locale) : tree.speciesId;
  }
  return locale === 'zhHans' ? '已选分组' : 'Selected group';
};

function App() {
  const [dayKey, setDayKey] = useState(() => formatDayKey());
  const [locale, setLocale] = useState<Locale>(() => loadLocale());
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizStates, setQuizStates] = useState<QuizState[]>([]);
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);

  const quizzes = useMemo(() => buildDailyQuizzes(dayKey), [dayKey]);
  const currentQuiz = quizzes[currentQuizIndex];
  const currentState = quizStates[currentQuizIndex];
  const currentEditor = currentState?.editor;
  const currentForest = useMemo(() => (currentEditor ? buildEditorForest(currentEditor) : []), [currentEditor]);
  const currentSolutionTree = useMemo(
    () => (currentQuiz ? buildSolutionDisplayTree(currentQuiz.solutionTree) : null),
    [currentQuiz],
  );
  const rootTreeMap = useMemo(() => new Map(currentForest.map((tree) => [tree.id, tree])), [currentForest]);
  const selectedLabels = selectedNodeIds
    .map((nodeId) => rootTreeMap.get(nodeId))
    .filter((tree): tree is TreeDisplayNode => Boolean(tree))
    .map((tree) => describeTree(tree, locale));

  useEffect(() => {
    const stored = loadStoredState(dayKey);
    if (stored) {
      setLocale(stored.locale);
      setCurrentQuizIndex(Math.min(stored.currentQuizIndex, quizzes.length - 1));
      setQuizStates(stored.quizStates.length === quizzes.length ? stored.quizStates : buildInitialQuizStates(quizzes));
    } else {
      setCurrentQuizIndex(0);
      setQuizStates(buildInitialQuizStates(quizzes));
    }
  }, [dayKey, quizzes]);

  useEffect(() => {
    saveLocale(locale);
  }, [locale]);

  useEffect(() => {
    if (quizStates.length !== quizzes.length) return;
    saveStoredState({
      dayKey,
      currentQuizIndex,
      quizStates,
      locale,
    });
  }, [dayKey, currentQuizIndex, quizStates, locale, quizzes.length]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDayKey(formatDayKey()), msUntilNextLocalMidnight() + 100);
    return () => window.clearTimeout(timeout);
  }, [dayKey]);

  useEffect(() => {
    if (!currentState) return;
    if (currentState.revealed) {
      setSelectedNodeIds([]);
      return;
    }
    setSelectedNodeIds((previous) => previous.filter((nodeId) => currentState.editor.rootIds.includes(nodeId)));
  }, [currentState]);

  const updateCurrentQuizState = (updater: (state: QuizState) => QuizState) => {
    setQuizStates((previous) =>
      previous.map((state, index) => (index === currentQuizIndex ? updater(state) : state)),
    );
  };

  const commitEditorChange = (nextEditor: TreeEditorState) => {
    if (!currentState) return;
    updateCurrentQuizState((state) => ({
      ...state,
      editor: nextEditor,
      history: [...state.history, cloneEditorState(state.editor)],
      future: [],
      revealed: false,
      isCorrect: null,
    }));
    setSelectedNodeIds([]);
  };

  const handleToggleNode = (nodeId: string) => {
    if (!currentEditor || currentState?.revealed || !currentEditor.rootIds.includes(nodeId)) return;
    setSelectedNodeIds((currentSelection) => {
      if (currentSelection.includes(nodeId)) {
        return [];
      }
      return [nodeId];
    });
  };

  const handleDragStart = (nodeId: string) => {
    if (currentState?.revealed) return;
    setSelectedNodeIds([nodeId]);
  };

  const handleDrop = (targetNodeId: string, draggedNodeId: string) => {
    if (!currentEditor || currentState?.revealed) return;
    const nextEditor = groupNodes(currentEditor, draggedNodeId, targetNodeId);
    if (!nextEditor) return;
    commitEditorChange(nextEditor);
  };

  const handleReset = () => {
    if (!currentQuiz || !currentState) return;
    commitEditorChange(createInitialEditorState(currentQuiz.speciesIds));
  };

  const handleSubmit = () => {
    if (!currentQuiz || !currentState || !currentEditor) return;
    const isCorrect = evaluateEditorTree(currentQuiz, currentEditor);
    updateCurrentQuizState((state) => ({ ...state, revealed: true, isCorrect }));
    setSelectedNodeIds([]);
  };

  const goToNextQuiz = () => {
    setSelectedNodeIds([]);
    setCurrentQuizIndex((index) => Math.min(index + 1, quizzes.length - 1));
  };

  const finished = quizStates.length > 0 && quizStates.every((state) => state.revealed);

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">letsTree</p>
          <h1>{locale === 'zhHans' ? '每日进化树挑战' : 'Daily phylogeny challenge'}</h1>
          <p className="subtle">
            {locale === 'zhHans'
              ? '把物种自由分组成一棵有根进化树，每个自然日会在你的本地午夜重置。'
              : 'Freely group taxa into a rooted tree. The daily set resets at your local midnight.'}
          </p>
        </div>
        <div className="header-actions">
          {(Object.keys(localeLabels) as Locale[]).map((value) => (
            <button
              key={value}
              type="button"
              className={`locale-chip ${locale === value ? 'active' : ''}`}
              onClick={() => setLocale(value)}
            >
              {localeLabels[value]}
            </button>
          ))}
        </div>
      </header>

      <section className="status-strip">
        <span>{locale === 'zhHans' ? '今天的日期' : 'Today'}</span>
        <strong>{dayKey}</strong>
        <span>
          {currentQuizIndex + 1}/{quizzes.length}
        </span>
      </section>

      {currentQuiz && currentState && currentEditor && currentSolutionTree ? (
        <section className="game-grid">
          <article className="panel quiz-panel">
            <div className="panel-header">
              <span className={`difficulty difficulty-${currentQuiz.difficulty}`}>{currentQuiz.difficulty}</span>
            </div>

            <div className="tree-canvas">
              <button
                type="button"
                className="workspace-reset"
                onClick={handleReset}
                disabled={currentState.revealed}
                aria-label={locale === 'zhHans' ? '重新开始' : 'Reset tree'}
                title={locale === 'zhHans' ? '重新开始' : 'Reset tree'}
              >
                <svg viewBox="0 0 21 21" aria-hidden="true" className="workspace-reset-icon">
                  <g
                    fill="none"
                    fillRule="evenodd"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    transform="translate(2 2)"
                  >
                    <path d="m12.5 1.5c2.4138473 1.37729434 4 4.02194088 4 7 0 4.418278-3.581722 8-8 8s-8-3.581722-8-8 3.581722-8 8-8" />
                    <path d="m12.5 5.5v-4h4" />
                  </g>
                </svg>
              </button>
              <TreeView
                trees={currentState.revealed ? [currentSolutionTree] : currentForest}
                locale={locale}
                selectedNodeIds={selectedNodeIds}
                interactive={!currentState.revealed}
                onNodeSelect={handleToggleNode}
                onNodeDrop={handleDrop}
                onNodeDragStart={handleDragStart}
              />
            </div>

            <div className="actions">
              <button
                type="button"
                className="primary"
                onClick={handleSubmit}
                disabled={!isEditorComplete(currentEditor) || currentState.revealed}
              >
                {locale === 'zhHans' ? '提交答案' : 'Submit answer'}
              </button>
            </div>

            {currentState.revealed && (
              <div className={`result-card ${currentState.isCorrect ? 'correct' : 'incorrect'}`}>
                <strong>{currentState.isCorrect ? (locale === 'zhHans' ? '答对了' : 'Correct') : locale === 'zhHans' ? '答案已揭晓' : 'Solution revealed'}</strong>
                <p>{toLocaleText(currentQuiz.explanation, locale)}</p>
                {currentQuizIndex < quizzes.length - 1 && (
                  <button type="button" className="primary" onClick={goToNextQuiz}>
                    {locale === 'zhHans' ? '下一题' : 'Next quiz'}
                  </button>
                )}
              </div>
            )}
          </article>

          <aside className="panel tray-panel">
            {selectedLabels.length > 0 ? (
              <div className="selection-card">
                <p className="eyebrow">{locale === 'zhHans' ? '已选根节点' : 'Selected roots'}</p>
                <div className="selected-list">
                  {selectedLabels.map((label, index) => (
                    <span key={`${label}-${index}`} className="selected-pill">
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="progress-list">
              {quizzes.map((quiz, index) => {
                const state = quizStates[index];
                const complete = state?.revealed ?? false;
                return (
                  <button
                    key={quiz.id}
                    type="button"
                    className={`progress-item ${index === currentQuizIndex ? 'active' : ''} ${complete ? (state?.isCorrect ? 'done' : 'missed') : ''}`}
                    onClick={() => setCurrentQuizIndex(index)}
                  >
                    <span>{index + 1}</span>
                    <span>{complete ? (state?.isCorrect ? (locale === 'zhHans' ? '已完成' : 'Solved') : locale === 'zhHans' ? '已揭晓' : 'Revealed') : locale === 'zhHans' ? '进行中' : 'Open'}</span>
                  </button>
                );
              })}
            </div>
          </aside>
        </section>
      ) : null}

      {finished && (
        <footer className="completion-banner">
          <strong>{locale === 'zhHans' ? '今日三题全部完成' : 'All 3 daily quizzes are complete'}</strong>
          <span>{locale === 'zhHans' ? '明天本地午夜会刷新新题目。' : 'A new set will appear at your next local midnight.'}</span>
        </footer>
      )}
    </main>
  );
}

export default App;
