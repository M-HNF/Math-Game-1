import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PlayerStats } from '../lib/gameData';

interface Props {
  stats: PlayerStats;
}

interface StatItemProps {
  icon: string;
  label: string;
  value: string | number;
  color: string;
  progress?: number;
  delay: number;
}

function StatItem({ icon, label, value, color, progress, delay }: StatItemProps) {
  const widthAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      delay,
      useNativeDriver: true,
    }).start();

    if (progress !== undefined) {
      Animated.timing(widthAnim, {
        toValue: Math.min(progress, 100),
        duration: 1000,
        delay: delay + 200,
        useNativeDriver: false,
      }).start();
    }
  }, [progress]);

  const barWidth = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[styles.statItem, { opacity: fadeAnim }]}>
      <View style={styles.statHeader}>
        <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon as any} size={18} color={color} />
        </View>
        <View style={styles.statInfo}>
          <Text style={styles.statLabel}>{label}</Text>
          <Text style={[styles.statValue, { color }]}>{value}</Text>
        </View>
      </View>
      {progress !== undefined && (
        <View style={styles.progressBar}>
          <Animated.View
            style={[
              styles.progressFill,
              { width: barWidth, backgroundColor: color },
            ]}
          />
        </View>
      )}
    </Animated.View>
  );
}

export default function ScoreBoard({ stats }: Props) {
  const accuracy =
    stats.totalSolved > 0
      ? Math.round((stats.totalCorrect / stats.totalSolved) * 100)
      : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="stats-chart" size={22} color="#667eea" />
        <Text style={styles.headerTitle}>Your Stats</Text>
      </View>

      <View style={styles.topStats}>
        <View style={styles.topStatItem}>
          <Text style={styles.topStatValue}>{stats.totalCorrect}</Text>
          <Text style={styles.topStatLabel}>Correct</Text>
        </View>
        <View style={[styles.topStatItem, styles.topStatCenter]}>
          <Text style={[styles.topStatValue, { color: '#4facfe' }]}>
            {stats.totalGames}
          </Text>
          <Text style={styles.topStatLabel}>Games</Text>
        </View>
        <View style={styles.topStatItem}>
          <Text style={[styles.topStatValue, { color: '#43e97b' }]}>
            {stats.bestScore}
          </Text>
          <Text style={styles.topStatLabel}>Best Score</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <StatItem
        icon="checkmark-done"
        label="Total Solved"
        value={stats.totalSolved}
        color="#667eea"
        progress={Math.min(stats.totalSolved, 100)}
        delay={0}
      />
      <StatItem
        icon="analytics"
        label="Accuracy"
        value={`${accuracy}%`}
        color="#43e97b"
        progress={accuracy}
        delay={100}
      />
      <StatItem
        icon="flame"
        label="Best Streak"
        value={stats.bestStreak}
        color="#f5576c"
        progress={Math.min(stats.bestStreak * 10, 100)}
        delay={200}
      />
      <StatItem
        icon="ribbon"
        label="Perfect Rounds"
        value={stats.perfectRounds}
        color="#FF9800"
        progress={Math.min(stats.perfectRounds * 20, 100)}
        delay={300}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
  },
  topStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  topStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  topStatCenter: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#2a2a3e',
  },
  topStatValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#667eea',
  },
  topStatLabel: {
    fontSize: 11,
    color: '#888',
    fontWeight: '600',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#2a2a3e',
    marginBottom: 16,
  },
  statItem: {
    marginBottom: 14,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  statIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  statInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 13,
    color: '#aaa',
    fontWeight: '600',
  },
  statValue: {
    fontSize: 15,
    fontWeight: '800',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#2a2a3e',
    borderRadius: 3,
    overflow: 'hidden',
    marginLeft: 44,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});
