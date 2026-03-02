// Types
export type GameMode = 'addition' | 'subtraction' | 'multiplication' | 'division';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameModeInfo {
  id: GameMode;
  title: string;
  subtitle: string;
  icon: string;
  gradient: [string, string];
  symbol: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  type: 'total_correct' | 'perfect_round' | 'speed' | 'streak' | 'games_played' | 'accuracy';
  unlocked: boolean;
}

export interface PlayerStats {
  totalSolved: number;
  totalCorrect: number;
  totalGames: number;
  bestScore: number;
  bestStreak: number;
  perfectRounds: number;
  averageTime: number;
  gamesPerMode: Record<GameMode, number>;
}

export interface PlayerProfile {
  name: string;
  avatar: number;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  preferredDifficulty: Difficulty;
}

export interface GameHistoryEntry {
  id: string;
  mode: GameMode;
  difficulty: Difficulty;
  score: number;
  correct: number;
  total: number;
  bestStreak: number;
  accuracy: number;
  timestamp: number;
}


// Constants
export const GAME_DURATION = 60; // seconds

export const DIFFICULTY_RANGES: Record<Difficulty, { min: number; max: number }> = {
  easy: { min: 1, max: 10 },
  medium: { min: 1, max: 50 },
  hard: { min: 1, max: 100 },
};

export const DIFFICULTY_INFO: Record<Difficulty, { label: string; color: string; stars: number }> = {
  easy: { label: 'Easy', color: '#4CAF50', stars: 1 },
  medium: { label: 'Medium', color: '#FF9800', stars: 2 },
  hard: { label: 'Hard', color: '#F44336', stars: 3 },
};

export const GAME_MODES: GameModeInfo[] = [
  {
    id: 'addition',
    title: 'Addition Rush',
    subtitle: 'Speed up your sums!',
    icon: 'add-circle',
    gradient: ['#667eea', '#764ba2'],
    symbol: '+',
  },
  {
    id: 'subtraction',
    title: 'Subtraction Challenge',
    subtitle: 'Master the minus!',
    icon: 'remove-circle',
    gradient: ['#f093fb', '#f5576c'],
    symbol: '−',
  },
  {
    id: 'multiplication',
    title: 'Multiplication Master',
    subtitle: 'Times table titan!',
    icon: 'close-circle',
    gradient: ['#4facfe', '#00f2fe'],
    symbol: '×',
  },
  {
    id: 'division',
    title: 'Division Dash',
    subtitle: 'Divide and conquer!',
    icon: 'ellipse',
    gradient: ['#43e97b', '#38f9d7'],
    symbol: '÷',
  },
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_steps',
    title: 'First Steps',
    description: 'Solve your first problem',
    icon: 'footsteps',
    requirement: 1,
    type: 'total_correct',
    unlocked: false,
  },
  {
    id: 'getting_started',
    title: 'Getting Started',
    description: 'Solve 10 problems correctly',
    icon: 'star',
    requirement: 10,
    type: 'total_correct',
    unlocked: false,
  },
  {
    id: 'math_whiz',
    title: 'Math Whiz',
    description: 'Solve 50 problems correctly',
    icon: 'flash',
    requirement: 50,
    type: 'total_correct',
    unlocked: false,
  },
  {
    id: 'math_genius',
    title: 'Math Genius',
    description: 'Solve 100 problems correctly',
    icon: 'trophy',
    requirement: 100,
    type: 'total_correct',
    unlocked: false,
  },
  {
    id: 'perfect_round',
    title: 'Perfect Round',
    description: 'Complete a round with 100% accuracy',
    icon: 'checkmark-circle',
    requirement: 1,
    type: 'perfect_round',
    unlocked: false,
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Answer 20+ questions in one round',
    icon: 'rocket',
    requirement: 20,
    type: 'speed',
    unlocked: false,
  },
  {
    id: 'on_fire',
    title: 'On Fire!',
    description: 'Get a streak of 10 correct answers',
    icon: 'flame',
    requirement: 10,
    type: 'streak',
    unlocked: false,
  },
  {
    id: 'dedicated',
    title: 'Dedicated',
    description: 'Play 20 games',
    icon: 'heart',
    requirement: 20,
    type: 'games_played',
    unlocked: false,
  },
  {
    id: 'sharpshooter',
    title: 'Sharpshooter',
    description: 'Maintain 90%+ accuracy over 5 games',
    icon: 'eye',
    requirement: 90,
    type: 'accuracy',
    unlocked: false,
  },
  {
    id: 'legend',
    title: 'Math Legend',
    description: 'Solve 500 problems correctly',
    icon: 'medal',
    requirement: 500,
    type: 'total_correct',
    unlocked: false,
  },
];

export const AVATARS = [
  { id: 0, icon: 'person-circle', color: '#667eea' },
  { id: 1, icon: 'happy', color: '#f5576c' },
  { id: 2, icon: 'school', color: '#4facfe' },
  { id: 3, icon: 'planet', color: '#43e97b' },
  { id: 4, icon: 'diamond', color: '#f093fb' },
  { id: 5, icon: 'rocket', color: '#FF9800' },
  { id: 6, icon: 'paw', color: '#764ba2' },
  { id: 7, icon: 'musical-notes', color: '#00f2fe' },
];

// Helper functions
export function generateProblem(mode: GameMode, difficulty: Difficulty): { num1: number; num2: number; answer: number } {
  const range = DIFFICULTY_RANGES[difficulty];
  let num1: number, num2: number, answer: number;

  switch (mode) {
    case 'addition':
      num1 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      num2 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      answer = num1 + num2;
      break;
    case 'subtraction':
      num1 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      num2 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      if (num2 > num1) [num1, num2] = [num2, num1];
      answer = num1 - num2;
      break;
    case 'multiplication':
      const multMax = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 12 : 15;
      num1 = Math.floor(Math.random() * multMax) + 1;
      num2 = Math.floor(Math.random() * multMax) + 1;
      answer = num1 * num2;
      break;
    case 'division':
      num2 = Math.floor(Math.random() * (range.max > 20 ? 20 : range.max)) + 1;
      answer = Math.floor(Math.random() * (range.max > 20 ? 20 : range.max)) + 1;
      num1 = num2 * answer;
      break;
    default:
      num1 = 1;
      num2 = 1;
      answer = 2;
  }

  return { num1, num2, answer };
}

export function generateChoices(correctAnswer: number): number[] {
  const choices = new Set<number>();
  choices.add(correctAnswer);

  while (choices.size < 4) {
    const offset = Math.floor(Math.random() * 10) + 1;
    const direction = Math.random() > 0.5 ? 1 : -1;
    const wrong = correctAnswer + offset * direction;
    if (wrong >= 0 && wrong !== correctAnswer) {
      choices.add(wrong);
    }
  }

  return Array.from(choices).sort(() => Math.random() - 0.5);
}

export function getScoreMultiplier(difficulty: Difficulty): number {
  switch (difficulty) {
    case 'easy': return 1;
    case 'medium': return 2;
    case 'hard': return 3;
  }
}

export const DEFAULT_STATS: PlayerStats = {
  totalSolved: 0,
  totalCorrect: 0,
  totalGames: 0,
  bestScore: 0,
  bestStreak: 0,
  perfectRounds: 0,
  averageTime: 0,
  gamesPerMode: {
    addition: 0,
    subtraction: 0,
    multiplication: 0,
    division: 0,
  },
};

export const DEFAULT_PROFILE: PlayerProfile = {
  name: 'Player',
  avatar: 0,
  soundEnabled: true,
  hapticEnabled: true,
  preferredDifficulty: 'easy',
};
