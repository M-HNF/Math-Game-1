import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGame } from './lib/GameContext';
import AchievementBadge from './components/AchievementBadge';

export default function AchievementsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { achievements, stats } = useGame();

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Achievements</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View style={styles.trophyCircle}>
              <Ionicons name="trophy" size={32} color="#FFD700" />
            </View>
            <View style={styles.progressInfo}>
              <Text style={styles.progressTitle}>Your Progress</Text>
              <Text style={styles.progressSubtitle}>
                {unlockedCount} of {totalCount} achievements unlocked
              </Text>
            </View>
          </View>

          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progressPercent}%` },
                ]}
              />
            </View>
            <Text style={styles.progressPercent}>{progressPercent}%</Text>
          </View>

          {/* Mini Stats */}
          <View style={styles.miniStats}>
            <View style={styles.miniStatItem}>
              <Ionicons name="checkmark-done" size={16} color="#43e97b" />
              <Text style={styles.miniStatValue}>{stats.totalCorrect}</Text>
              <Text style={styles.miniStatLabel}>Correct</Text>
            </View>
            <View style={styles.miniStatItem}>
              <Ionicons name="game-controller" size={16} color="#4facfe" />
              <Text style={styles.miniStatValue}>{stats.totalGames}</Text>
              <Text style={styles.miniStatLabel}>Games</Text>
            </View>
            <View style={styles.miniStatItem}>
              <Ionicons name="flame" size={16} color="#f5576c" />
              <Text style={styles.miniStatValue}>{stats.bestStreak}</Text>
              <Text style={styles.miniStatLabel}>Streak</Text>
            </View>
            <View style={styles.miniStatItem}>
              <Ionicons name="ribbon" size={16} color="#FF9800" />
              <Text style={styles.miniStatValue}>{stats.perfectRounds}</Text>
              <Text style={styles.miniStatLabel}>Perfect</Text>
            </View>
          </View>
        </View>

        {/* Unlocked Achievements */}
        {unlockedCount > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Ionicons name="star" size={18} color="#FFD700" />
              <Text style={styles.sectionTitle}>Unlocked</Text>
              <View style={styles.sectionBadge}>
                <Text style={styles.sectionBadgeText}>{unlockedCount}</Text>
              </View>
            </View>
            <View style={styles.grid}>
              {achievements
                .filter((a) => a.unlocked)
                .map((achievement, index) => (
                  <AchievementBadge
                    key={achievement.id}
                    achievement={achievement}
                    index={index}
                  />
                ))}
            </View>
          </>
        )}

        {/* Locked Achievements */}
        <View style={styles.sectionHeader}>
          <Ionicons name="lock-closed" size={18} color="#666" />
          <Text style={[styles.sectionTitle, { color: '#888' }]}>Locked</Text>
          <View style={[styles.sectionBadge, { backgroundColor: '#2a2a3e' }]}>
            <Text style={[styles.sectionBadgeText, { color: '#888' }]}>
              {totalCount - unlockedCount}
            </Text>
          </View>
        </View>
        <View style={styles.grid}>
          {achievements
            .filter((a) => !a.unlocked)
            .map((achievement, index) => (
              <AchievementBadge
                key={achievement.id}
                achievement={achievement}
                index={index}
              />
            ))}
        </View>

        {/* Motivational Footer */}
        <View style={styles.motivational}>
          <Ionicons name="sparkles" size={20} color="#667eea" />
          <Text style={styles.motivationalText}>
            Keep playing to unlock more achievements!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  progressCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  trophyCircle: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#FFD70015',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressInfo: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
  },
  progressSubtitle: {
    fontSize: 13,
    color: '#888',
    fontWeight: '500',
    marginTop: 2,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#2a2a3e',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFD700',
  },
  miniStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  miniStatItem: {
    alignItems: 'center',
    gap: 4,
  },
  miniStatValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },
  miniStatLabel: {
    fontSize: 10,
    color: '#888',
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
  },
  sectionBadge: {
    backgroundColor: '#FFD70030',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  sectionBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFD700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  motivational: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 20,
  },
  motivationalText: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
  },
});
