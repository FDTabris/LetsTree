import { useEffect, useMemo, useState } from 'react';
import {
  buildDailyQuizzes,
  buildInitialQuizStates,
  clearPlacements,
  collectSlotIds,
  createEmptyPlacements,
  deserializeState,
  evaluatePlacements,
  formatDayKey,
  getPlacedSpeciesIds,
  getSpecies,
  getUnplacedSpecies,
  localStorageKeys,
  msUntilNextLocalMidnight,
  normalizePlacements,
  serializeState,
  toLocaleText,
} from './game';
import { Locale, QuizState, TreeTopologyOption } from './types';
import { TreeView } from './treeRenderer';

type StoredState = {
  dayKey: string;
  currentQuizIndex: number;
  quizStates: QuizState[];
  locale: Locale;
};

function TopologyPicker({
  locale,
  choices,
  selectedTopologyId,
  onChoose,
}: {
  locale: Locale;
  choices: TreeTopologyOption[];
  selectedTopologyId: string | null;
  onChoose: (id: string) => void;
}) {
  return (
    <div className="topology-picker">
      <p className="eyebrow">{locale === 'zhHans' ? '先选树形' : 'Choose the tree shape first'}</p>
      <div className="topology-grid">
        {choices.map((choice) => (
          <button
            key={choice.id}
            type="button"
            className={`topology-card ${selectedTopologyId === choice.id ? 'selected' : ''}`}
            onClick={() => onChoose(choice.id)}
          >
            <strong>{toLocaleText(choice.label, locale)}</strong>
          </button>
        ))}
      </div>
    </div>
  );
}

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

const loadStoredState = (dayKey: string): StoredState | null => {
  const parsed = deserializeState<StoredState>(window.localStorage.getItem(localStorageKeys.state));
  if (!parsed || parsed.dayKey !== dayKey) return null;
  if (parsed.quizStates.some((state) => typeof state.selectedTopologyId === 'undefined')) return null;
  return parsed;
};

const saveStoredState = (state: StoredState) => {
  window.localStorage.setItem(localStorageKeys.state, serializeState(state));
};

function SpeciesCard({
  speciesId,
  locale,
  selected,
  disabled,
  onSelect,
  onDragStart,
}: {
  speciesId: string;
  locale: Locale;
  selected: boolean;
  disabled: boolean;
  onSelect: (speciesId: string) => void;
  onDragStart: (speciesId: string) => void;
}) {
  const species = getSpecies(speciesId);
  if (!species) return null;
  const primary = toLocaleText(species.names, locale);
  const secondary = toLocaleText(species.names, locale === 'en' ? 'zhHans' : 'en');

  return (
    <button
      type="button"
      className={`species-card ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
      draggable={!disabled}
      onDragStart={(event) => {
        event.dataTransfer.setData('text/plain', speciesId);
        event.dataTransfer.effectAllowed = 'move';
        onDragStart(speciesId);
      }}
      onClick={() => onSelect(speciesId)}
      disabled={disabled}
    >
      <img src={species.photoUrl} alt={primary} className="species-photo" loading="lazy" />
      <span className="species-primary">{primary}</span>
      <span className="species-secondary">{secondary}</span>
    </button>
  );
}

function App() {
  const [dayKey, setDayKey] = useState(() => formatDayKey());
  const [locale, setLocale] = useState<Locale>(() => loadLocale());
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizStates, setQuizStates] = useState<QuizState[]>([]);
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<string | null>(null);

  const quizzes = useMemo(() => buildDailyQuizzes(dayKey), [dayKey]);
  const currentQuiz = quizzes[currentQuizIndex];
  const currentState = quizStates[currentQuizIndex];

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

  const updateCurrentPlacements = (nextPlacements: Record<string, string | null>) => {
    setQuizStates((prev) =>
      prev.map((state, index) => (index === currentQuizIndex ? { ...state, placements: nextPlacements } : state)),
    );
  };

  const slotIds = currentQuiz ? collectSlotIds(currentQuiz.layout) : [];
  const activeLayout =
    currentQuiz?.topologyChoices && currentState?.selectedTopologyId
      ? currentQuiz.topologyChoices.find((choice) => choice.id === currentState.selectedTopologyId)?.layout ?? currentQuiz.layout
      : currentQuiz?.layout;
  const currentPlacements = currentState?.placements ?? createEmptyPlacements(currentQuiz?.layout ?? { id: 'root', kind: 'branch', children: [] });
  const placedSpecies = getPlacedSpeciesIds(currentPlacements);
  const unplacedSpecies = currentQuiz ? getUnplacedSpecies(currentPlacements, currentQuiz.speciesIds) : [];
  const topologyLocked = !currentQuiz?.requiredTopologyChoice || Boolean(currentState?.selectedTopologyId);
  const showTree = Boolean(activeLayout) && (!currentQuiz?.requiredTopologyChoice || topologyLocked || currentState?.revealed);

  const handleSelectSpecies = (speciesId: string) => {
    setSelectedSpeciesId((current) => (current === speciesId ? null : speciesId));
  };

  const handleChooseTopology = (topologyId: string) => {
    if (!currentQuiz || !currentState) return;
    const nextPlacements = createEmptyPlacements(currentQuiz.layout);
    setQuizStates((prev) =>
      prev.map((state, index) =>
        index === currentQuizIndex
            ? { ...state, selectedTopologyId: topologyId, placements: nextPlacements, revealed: false, isCorrect: null }
            : state,
      ),
    );
    setSelectedSpeciesId(null);
  };

  const handleSlotClick = (slotId: string) => {
    if (!currentQuiz || !currentState || !topologyLocked) return;
    const currentSpecies = currentPlacements[slotId];
    if (selectedSpeciesId) {
      const nextPlacements = normalizePlacements(currentPlacements, slotIds, selectedSpeciesId, slotId);
      updateCurrentPlacements(nextPlacements);
      setSelectedSpeciesId(null);
      return;
    }
    if (currentSpecies) {
      setSelectedSpeciesId(currentSpecies);
      const nextPlacements = { ...currentPlacements, [slotId]: null };
      updateCurrentPlacements(nextPlacements);
    }
  };

  const handleSlotDrop = (slotId: string, speciesId: string) => {
    if (!currentQuiz || !currentState || !topologyLocked) return;
    const nextPlacements = normalizePlacements(currentPlacements, slotIds, speciesId, slotId);
    updateCurrentPlacements(nextPlacements);
    setSelectedSpeciesId(null);
  };

  const handleReset = () => {
    if (!currentQuiz || !currentState) return;
    updateCurrentPlacements(clearPlacements(currentPlacements, slotIds));
    setSelectedSpeciesId(null);
  };

  const handleSubmit = () => {
    if (!currentQuiz || !currentState) return;
    const topologyCorrect = !currentQuiz.requiredTopologyChoice || currentState.selectedTopologyId === currentQuiz.correctTopologyId;
    const placementsCorrect = evaluatePlacements(currentQuiz, currentPlacements);
    const isCorrect = topologyCorrect && placementsCorrect;
    setQuizStates((prev) =>
      prev.map((state, index) => (index === currentQuizIndex ? { ...state, revealed: true, isCorrect } : state)),
    );
  };

  const goToNextQuiz = () => {
    setSelectedSpeciesId(null);
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
              ? '每个自然日会在你的本地午夜重置。'
              : 'The daily set resets at your local midnight.'}
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

      {currentQuiz && currentState ? (
        <section className="game-grid">
          <article className="panel quiz-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">
                  {locale === 'zhHans' ? `题目 ${currentQuizIndex + 1}` : `Quiz ${currentQuizIndex + 1}`}
                </p>
                <h2>{toLocaleText(currentQuiz.prompt, locale)}</h2>
              </div>
              <span className={`difficulty difficulty-${currentQuiz.difficulty}`}>{currentQuiz.difficulty}</span>
            </div>

            {currentQuiz.topologyChoices && !currentState.revealed ? (
              <TopologyPicker
                locale={locale}
                choices={currentQuiz.topologyChoices}
                selectedTopologyId={currentState.selectedTopologyId}
                onChoose={handleChooseTopology}
              />
            ) : null}

            {showTree ? (
              <div className="tree-canvas">
                <TreeView
                  root={currentState.revealed ? currentQuiz.layout : activeLayout}
                  placements={currentPlacements}
                  correctPlacements={currentQuiz.correctPlacements}
                  locale={locale}
                  selectedSpeciesId={selectedSpeciesId}
                  onSlotClick={handleSlotClick}
                  onSlotDrop={handleSlotDrop}
                  review={currentState.revealed}
                />
              </div>
            ) : null}

            <div className="actions">
              <button type="button" className="secondary" onClick={handleReset}>
                {locale === 'zhHans' ? '重置' : 'Reset'}
              </button>
              <button
                type="button"
                className="primary"
                onClick={handleSubmit}
                disabled={
                  Object.values(currentPlacements).some((value) => value === null) ||
                  currentState.revealed ||
                  !topologyLocked
                }
              >
                {locale === 'zhHans' ? '提交答案' : 'Submit answer'}
              </button>
            </div>

            {currentState.revealed && (
              <div className={`result-card ${currentState.isCorrect ? 'correct' : 'incorrect'}`}>
                <strong>{currentState.isCorrect ? (locale === 'zhHans' ? '答对了' : 'Correct') : locale === 'zhHans' ? '答案已揭晓' : 'Solution revealed'}</strong>
                <p>{toLocaleText(currentQuiz.explanation, locale)}</p>
                <div className="solution-grid">
                  {slotIds.map((slotId) => {
                    const speciesId = currentQuiz.correctPlacements[slotId];
                    const species = getSpecies(speciesId);
                    if (!species) return null;
                    return (
                      <div key={slotId} className="solution-item">
                        <span className="solution-slot">{slotId}</span>
                        <span>{toLocaleText(species.names, locale)}</span>
                      </div>
                    );
                  })}
                </div>
                {currentQuizIndex < quizzes.length - 1 && (
                  <button type="button" className="primary" onClick={goToNextQuiz}>
                    {locale === 'zhHans' ? '下一题' : 'Next quiz'}
                  </button>
                )}
              </div>
            )}
          </article>

          <aside className="panel tray-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">{locale === 'zhHans' ? '物种卡片' : 'Species cards'}</p>
                <h2>{locale === 'zhHans' ? '拖放或点选物种' : 'Drag or tap a species'}</h2>
              </div>
            </div>
            <div className="species-grid">
              {unplacedSpecies.map((species) => (
                <SpeciesCard
                  key={species.id}
                  speciesId={species.id}
                  locale={locale}
                  selected={selectedSpeciesId === species.id}
                  disabled={currentState.revealed}
                  onSelect={handleSelectSpecies}
                  onDragStart={(speciesId) => setSelectedSpeciesId(speciesId)}
                />
              ))}
            </div>
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
