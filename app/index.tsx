import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGame } from './lib/GameContext';
import {
  GAME_MODES,
  AVATARS,
  DIFFICULTY_INFO,
  Difficulty,
  GameHistoryEntry,
} from './lib/gameData';
import GameModeCard from './components/GameModeCard';
import DifficultySelector from './components/DifficultySelector';
import ScoreBoard from './components/ScoreBoard';
import FloatingShapes from './components/FloatingShapes';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ── Helpers ──────────────────────────────────────────────────────

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

function getModeInfo(modeId: string) {
  return GAME_MODES.find((m) => m.id === modeId) || GAME_MODES[0];
}

// ── History Row ──────────────────────────────────────────────────

function HistoryRow({ entry, index }: { entry: GameHistoryEntry; index: number }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const modeInfo = getModeInfo(entry.mode);
  const diffInfo = DIFFICULTY_INFO[entry.difficulty];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay: index * 80,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        historyStyles.row,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateX: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={[historyStyles.modeIcon, { backgroundColor: modeInfo.gradient[0] + '20' }]}>
        <Ionicons name={modeInfo.icon as any} size={20} color={modeInfo.gradient[0]} />
      </View>

      <View style={historyStyles.info}>
        <Text style={historyStyles.modeName}>{modeInfo.title}</Text>
        <View style={historyStyles.metaRow}>
          <Text style={[historyStyles.diffLabel, { color: diffInfo.color }]}>
            {diffInfo.label}
          </Text>
          <Text style={historyStyles.dot}>·</Text>
          <Text style={historyStyles.timeAgo}>{formatTimeAgo(entry.timestamp)}</Text>
        </View>
      </View>

      <View style={historyStyles.stats}>
        <Text style={historyStyles.score}>{entry.score}</Text>
        <Text style={historyStyles.accuracy}>{entry.accuracy}%</Text>
      </View>
    </Animated.View>
  );
}

// ── Main Screen ──────────────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { stats, profile, achievements, gameHistory } = useGame();
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(
    profile.preferredDifficulty
  );

  const heroAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(heroAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(titleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const currentAvatar = AVATARS[profile.avatar] || AVATARS[0];
  const recentGames = gameHistory.slice(0, 5);

  const handleStartGame = (modeId: string) => {
    router.push({
      pathname: '/game',
      params: { mode: modeId, difficulty: selectedDifficulty },
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FloatingShapes />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <View style={styles.headerLeft}>
            <View style={[styles.avatarCircle, { borderColor: currentAvatar.color }]}>
              <Ionicons name={currentAvatar.icon as any} size={20} color={currentAvatar.color} />
            </View>
            <View>
              <Text style={styles.greeting}>Hello,</Text>
              <Text style={styles.playerName}>{profile.name}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.headerBtn}
              onPress={() => router.push('/achievements')}
            >
              <Ionicons name="trophy" size={22} color="#FFD700" />
              {unlockedCount > 0 && (
                <View style={styles.headerBadge}>
                  <Text style={styles.headerBadgeText}>{unlockedCount}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerBtn}
              onPress={() => router.push('/settings')}
            >
              <Ionicons name="settings" size={22} color="#888" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Section */}
        <Animated.View
          style={[
            styles.hero,
            {
              opacity: heroAnim,
              transform: [
                {
                  translateY: heroAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.heroContent}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <View style={styles.heroIconContainer}>
                <Ionicons name="calculator" size={44} color="#fff" />
              </View>
            </Animated.View>
            <Animated.View
              style={{
                opacity: titleAnim,
                transform: [
                  {
                    translateY: titleAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              }}
            >
              <Text style={styles.heroTitle}>MathBlitz</Text>
              <Text style={styles.heroSubtitle}>
                Train your brain with fun math challenges!
              </Text>
            </Animated.View>
          </View>

          {/* Quick Stats */}
          <View style={styles.quickStats}>
            <View style={styles.quickStatItem}>
              <Text style={styles.quickStatValue}>{stats.totalCorrect}</Text>
              <Text style={styles.quickStatLabel}>Solved</Text>
            </View>
            <View style={styles.quickStatDivider} />
            <View style={styles.quickStatItem}>
              <Text style={[styles.quickStatValue, { color: '#43e97b' }]}>
                {stats.totalSolved > 0
                  ? Math.round((stats.totalCorrect / stats.totalSolved) * 100)
                  : 0}
                %
              </Text>
              <Text style={styles.quickStatLabel}>Accuracy</Text>
            </View>
            <View style={styles.quickStatDivider} />
            <View style={styles.quickStatItem}>
              <Text style={[styles.quickStatValue, { color: '#f5576c' }]}>
                {stats.bestStreak}
              </Text>
              <Text style={styles.quickStatLabel}>Streak</Text>
            </View>
          </View>
        </Animated.View>

        {/* Difficulty Selector */}
        <View style={styles.section}>
          <DifficultySelector
            selected={selectedDifficulty}
            onSelect={setSelectedDifficulty}
          />
        </View>

        {/* Game Modes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="game-controller" size={20} color="#667eea" />
            <Text style={styles.sectionTitle}>Game Modes</Text>
          </View>
          <View style={styles.modesGrid}>
            {GAME_MODES.map((mode, index) => (
              <GameModeCard
                key={mode.id}
                mode={mode}
                gamesPlayed={stats.gamesPerMode[mode.id]}
                index={index}
                onPress={() => handleStartGame(mode.id)}
              />
            ))}
          </View>
        </View>

        {/* Recent Games */}
        {recentGames.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="time" size={20} color="#4facfe" />
              <Text style={styles.sectionTitle}>Recent Games</Text>
              <View style={styles.sectionBadge}>
                <Text style={styles.sectionBadgeText}>{gameHistory.length}</Text>
              </View>
            </View>
            <View style={historyStyles.container}>
              {recentGames.map((entry, index) => (
                <HistoryRow key={entry.id} entry={entry} index={index} />
              ))}
            </View>
          </View>
        )}

        {/* Score Dashboard */}
        <View style={styles.section}>
          <ScoreBoard stats={stats} />
        </View>

        {/* Achievements Preview */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.achievementPreview}
            onPress={() => router.push('/achievements')}
            activeOpacity={0.8}
          >
            <View style={styles.achievementPreviewLeft}>
              <View style={styles.achievementIconCircle}>
                <Ionicons name="trophy" size={24} color="#FFD700" />
              </View>
              <View>
                <Text style={styles.achievementPreviewTitle}>Achievements</Text>
                <Text style={styles.achievementPreviewSub}>
                  {unlockedCount} / {achievements.length} unlocked
                </Text>
              </View>
            </View>
            <View style={styles.achievementProgress}>
              <View style={styles.achievementProgressBar}>
                <View
                  style={[
                    styles.achievementProgressFill,
                    {
                      width: `${(unlockedCount / achievements.length) * 100}%`,
                    },
                  ]}
                />
              </View>
              <Ionicons name="chevron-forward" size={20} color="#888" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Daily Tip */}
        <View style={styles.section}>
          <View style={styles.tipCard}>
            <View style={styles.tipIcon}>
              <Ionicons name="bulb" size={24} color="#FF9800" />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Math Tip of the Day</Text>
              <Text style={styles.tipText}>
                Practice multiplication tables daily — they're the building blocks for division, fractions, and algebra!
              </Text>
            </View>
          </View>
        </View>

        {/* Saved Data Indicator */}
        <View style={styles.savedIndicator}>
          <Ionicons name="cloud-done" size={16} color="#43e97b" />
          <Text style={styles.savedText}>Progress saved locally</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>MathBlitz v1.0</Text>
          <Text style={styles.footerSubtext}>Made with love for math learners</Text>
        </View>
      </ScrollView>
    </View>
  );
}

// ── History Styles ───────────────────────────────────────────────

const historyStyles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a2e',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a3e',
  },
  modeIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  modeName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  diffLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  dot: {
    fontSize: 11,
    color: '#555',
  },
  timeAgo: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  stats: {
    alignItems: 'flex-end',
  },
  score: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFD700',
  },
  accuracy: {
    fontSize: 11,
    color: '#888',
    fontWeight: '600',
    marginTop: 1,
  },
});

// ── Main Styles ──────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d1a',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  greeting: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
  playerName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  headerBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#f5576c',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  headerBadgeText: {
    fontSize: 9,
    color: '#fff',
    fontWeight: '800',
  },
  hero: {
    backgroundColor: '#1a1a2e',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  heroContent: {
    alignItems: 'center',
    marginBottom: 20,
  },
  heroIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 8,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: -1,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 6,
    fontWeight: '500',
  },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: '#0d0d1a',
    borderRadius: 16,
    padding: 16,
  },
  quickStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  quickStatDivider: {
    width: 1,
    backgroundColor: '#2a2a3e',
  },
  quickStatValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#667eea',
  },
  quickStatLabel: {
    fontSize: 11,
    color: '#888',
    fontWeight: '600',
    marginTop: 2,
  },
  section: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    flex: 1,
  },
  sectionBadge: {
    backgroundColor: '#4facfe20',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  sectionBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4facfe',
  },
  modesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementPreview: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  achievementPreviewLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  achievementIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFD70020',
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementPreviewTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  achievementPreviewSub: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
    marginTop: 2,
  },
  achievementProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  achievementProgressBar: {
    width: 60,
    height: 6,
    backgroundColor: '#2a2a3e',
    borderRadius: 3,
    overflow: 'hidden',
  },
  achievementProgressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 3,
  },
  tipCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    gap: 14,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  tipIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FF980020',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF9800',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 12,
    color: '#aaa',
    lineHeight: 18,
    fontWeight: '500',
  },
  savedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    marginTop: 8,
  },
  savedText: {
    fontSize: 12,
    color: '#43e97b',
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 13,
    color: '#555',
    fontWeight: '600',
  },
  footerSubtext: {
    fontSize: 11,
    color: '#444',
    marginTop: 4,
  },
});
