import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  PlayerStats,
  PlayerProfile,
  Achievement,
  GameHistoryEntry,
  DEFAULT_STATS,
  DEFAULT_PROFILE,
  ACHIEVEMENTS,
} from './gameData';

// Storage keys
const KEYS = {
  STATS: '@mathblitz_stats',
  PROFILE: '@mathblitz_profile',
  ACHIEVEMENTS: '@mathblitz_achievements',
  HISTORY: '@mathblitz_history',
} as const;

const MAX_HISTORY_ENTRIES = 50;

// ── Generic helpers ──────────────────────────────────────────────

async function getItem<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw !== null) {
      return JSON.parse(raw) as T;
    }
  } catch (err) {
    console.warn(`[Storage] Failed to read "${key}":`, err);
  }
  return fallback;
}

async function setItem<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`[Storage] Failed to write "${key}":`, err);
  }
}

// ── Stats ────────────────────────────────────────────────────────

export async function loadStats(): Promise<PlayerStats> {
  const saved = await getItem<PlayerStats>(KEYS.STATS, DEFAULT_STATS);
  // Merge with defaults so new fields added in future updates are present
  return { ...DEFAULT_STATS, ...saved, gamesPerMode: { ...DEFAULT_STATS.gamesPerMode, ...(saved.gamesPerMode || {}) } };
}

export async function saveStats(stats: PlayerStats): Promise<void> {
  await setItem(KEYS.STATS, stats);
}

// ── Profile ──────────────────────────────────────────────────────

export async function loadProfile(): Promise<PlayerProfile> {
  const saved = await getItem<PlayerProfile>(KEYS.PROFILE, DEFAULT_PROFILE);
  return { ...DEFAULT_PROFILE, ...saved };
}

export async function saveProfile(profile: PlayerProfile): Promise<void> {
  await setItem(KEYS.PROFILE, profile);
}

// ── Achievements ─────────────────────────────────────────────────

export async function loadAchievements(): Promise<Achievement[]> {
  const saved = await getItem<Achievement[]>(KEYS.ACHIEVEMENTS, ACHIEVEMENTS);
  // Merge: keep unlock status from storage but use latest definitions
  // This handles the case where new achievements are added in an update
  return ACHIEVEMENTS.map((def) => {
    const stored = saved.find((s) => s.id === def.id);
    return stored ? { ...def, unlocked: stored.unlocked } : def;
  });
}

export async function saveAchievements(achievements: Achievement[]): Promise<void> {
  await setItem(KEYS.ACHIEVEMENTS, achievements);
}

// ── Game History ─────────────────────────────────────────────────

export async function loadHistory(): Promise<GameHistoryEntry[]> {
  return getItem<GameHistoryEntry[]>(KEYS.HISTORY, []);
}

export async function saveHistory(history: GameHistoryEntry[]): Promise<void> {
  // Keep only the most recent entries
  const trimmed = history.slice(0, MAX_HISTORY_ENTRIES);
  await setItem(KEYS.HISTORY, trimmed);
}

export async function appendHistoryEntry(entry: GameHistoryEntry): Promise<GameHistoryEntry[]> {
  const current = await loadHistory();
  const updated = [entry, ...current].slice(0, MAX_HISTORY_ENTRIES);
  await saveHistory(updated);
  return updated;
}

// ── Bulk operations ──────────────────────────────────────────────

export interface StorageSnapshot {
  stats: PlayerStats;
  profile: PlayerProfile;
  achievements: Achievement[];
  history: GameHistoryEntry[];
}

export async function loadAll(): Promise<StorageSnapshot> {
  const [stats, profile, achievements, history] = await Promise.all([
    loadStats(),
    loadProfile(),
    loadAchievements(),
    loadHistory(),
  ]);
  return { stats, profile, achievements, history };
}

export async function clearAll(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      KEYS.STATS,
      KEYS.PROFILE,
      KEYS.ACHIEVEMENTS,
      KEYS.HISTORY,
    ]);
  } catch (err) {
    console.warn('[Storage] Failed to clear all:', err);
  }
}
