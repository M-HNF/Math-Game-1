import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from 'react';
import {
  PlayerStats,
  PlayerProfile,
  Achievement,
  GameHistoryEntry,
  DEFAULT_STATS,
  DEFAULT_PROFILE,
  ACHIEVEMENTS,
  GameMode,
  Difficulty,
} from './gameData';

import {
  loadAll,
  saveStats,
  saveProfile,
  saveAchievements,
  saveHistory,
  clearAll,
} from './storage';

// ── Context type ─────────────────────────────────────────────────

interface GameState {
  isLoaded: boolean;
  stats: PlayerStats;
  profile: PlayerProfile;
  achievements: Achievement[];
  gameHistory: GameHistoryEntry[];
  updateStats: (updates: Partial<PlayerStats>) => void;
  updateProfile: (updates: Partial<PlayerProfile>) => void;
  recordGameResult: (
    mode: GameMode,
    difficulty: Difficulty,
    correct: number,
    total: number,
    score: number,
    streak: number
  ) => void;
  resetStats: () => void;
}

const GameContext = createContext<GameState | undefined>(undefined);

// ── Provider ─────────────────────────────────────────────────────

export function GameProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [stats, setStats] = useState<PlayerStats>(DEFAULT_STATS);
  const [profile, setProfile] = useState<PlayerProfile>(DEFAULT_PROFILE);
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);
  const [gameHistory, setGameHistory] = useState<GameHistoryEntry[]>([]);

  // Flags to avoid saving the initial default values before storage loads
  const hasLoadedRef = useRef(false);
  const saveTimeoutStats = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveTimeoutProfile = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveTimeoutAchievements = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Load from storage on mount ─────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const snapshot = await loadAll();
        if (cancelled) return;

        setStats(snapshot.stats);
        setProfile(snapshot.profile);
        setAchievements(snapshot.achievements);
        setGameHistory(snapshot.history);
      } catch (err) {
        console.warn('[GameContext] Failed to load saved data:', err);
      } finally {
        if (!cancelled) {
          hasLoadedRef.current = true;
          setIsLoaded(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // ── Auto-save stats (debounced) ────────────────────────────────
  useEffect(() => {
    if (!hasLoadedRef.current) return;
    if (saveTimeoutStats.current) clearTimeout(saveTimeoutStats.current);
    saveTimeoutStats.current = setTimeout(() => {
      saveStats(stats);
    }, 300);
    return () => {
      if (saveTimeoutStats.current) clearTimeout(saveTimeoutStats.current);
    };
  }, [stats]);

  // ── Auto-save profile (debounced) ──────────────────────────────
  useEffect(() => {
    if (!hasLoadedRef.current) return;
    if (saveTimeoutProfile.current) clearTimeout(saveTimeoutProfile.current);
    saveTimeoutProfile.current = setTimeout(() => {
      saveProfile(profile);
    }, 300);
    return () => {
      if (saveTimeoutProfile.current) clearTimeout(saveTimeoutProfile.current);
    };
  }, [profile]);

  // ── Auto-save achievements (debounced) ─────────────────────────
  useEffect(() => {
    if (!hasLoadedRef.current) return;
    if (saveTimeoutAchievements.current) clearTimeout(saveTimeoutAchievements.current);
    saveTimeoutAchievements.current = setTimeout(() => {
      saveAchievements(achievements);
    }, 300);
    return () => {
      if (saveTimeoutAchievements.current) clearTimeout(saveTimeoutAchievements.current);
    };
  }, [achievements]);

  // ── Achievement checker ────────────────────────────────────────
  const checkAchievements = useCallback((newStats: PlayerStats) => {
    setAchievements((prev) =>
      prev.map((achievement) => {
        if (achievement.unlocked) return achievement;

        let unlocked = false;
        switch (achievement.type) {
          case 'total_correct':
            unlocked = newStats.totalCorrect >= achievement.requirement;
            break;
          case 'perfect_round':
            unlocked = newStats.perfectRounds >= achievement.requirement;
            break;
          case 'speed':
            unlocked = newStats.bestScore >= achievement.requirement;
            break;
          case 'streak':
            unlocked = newStats.bestStreak >= achievement.requirement;
            break;
          case 'games_played':
            unlocked = newStats.totalGames >= achievement.requirement;
            break;
          case 'accuracy':
            if (newStats.totalSolved > 0) {
              const accuracy = (newStats.totalCorrect / newStats.totalSolved) * 100;
              unlocked = accuracy >= achievement.requirement && newStats.totalGames >= 5;
            }
            break;
        }

        return unlocked ? { ...achievement, unlocked: true } : achievement;
      })
    );
  }, []);

  // ── Public actions ─────────────────────────────────────────────

  const updateStats = useCallback(
    (updates: Partial<PlayerStats>) => {
      setStats((prev) => {
        const newStats = { ...prev, ...updates };
        checkAchievements(newStats);
        return newStats;
      });
    },
    [checkAchievements]
  );

  const updateProfile = useCallback((updates: Partial<PlayerProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  }, []);

  const recordGameResult = useCallback(
    (
      mode: GameMode,
      difficulty: Difficulty,
      correct: number,
      total: number,
      score: number,
      streak: number
    ) => {
      // Update stats
      setStats((prev) => {
        const newStats: PlayerStats = {
          totalSolved: prev.totalSolved + total,
          totalCorrect: prev.totalCorrect + correct,
          totalGames: prev.totalGames + 1,
          bestScore: Math.max(prev.bestScore, score),
          bestStreak: Math.max(prev.bestStreak, streak),
          perfectRounds:
            correct === total && total > 0
              ? prev.perfectRounds + 1
              : prev.perfectRounds,
          averageTime: prev.averageTime,
          gamesPerMode: {
            ...prev.gamesPerMode,
            [mode]: prev.gamesPerMode[mode] + 1,
          },
        };
        checkAchievements(newStats);
        return newStats;
      });

      // Add history entry
      const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
      const entry: GameHistoryEntry = {
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        mode,
        difficulty,
        score,
        correct,
        total,
        bestStreak: streak,
        accuracy,
        timestamp: Date.now(),
      };

      setGameHistory((prev) => {
        const updated = [entry, ...prev].slice(0, 50);
        // Persist immediately (not debounced – game results are important)
        saveHistory(updated);
        return updated;
      });
    },
    [checkAchievements]
  );

  const resetStats = useCallback(() => {
    setStats(DEFAULT_STATS);
    setAchievements(ACHIEVEMENTS);
    setGameHistory([]);
    // Clear persisted data
    clearAll();
    // Re-save the profile so it isn't lost
    saveProfile(profile);
  }, [profile]);

  return (
    <GameContext.Provider
      value={{
        isLoaded,
        stats,
        profile,
        achievements,
        gameHistory,
        updateStats,
        updateProfile,
        recordGameResult,
        resetStats,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────

export function useGame(): GameState {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
