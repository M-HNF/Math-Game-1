import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Achievement } from '../lib/gameData';

interface Props {
  achievement: Achievement;
  index: number;
}

const BADGE_COLORS = [
  '#667eea', '#f5576c', '#4facfe', '#43e97b',
  '#f093fb', '#FF9800', '#764ba2', '#00f2fe',
  '#e91e63', '#00bcd4',
];

export default function AchievementBadge({ achievement, index }: Props) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      delay: index * 80,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();

    if (achievement.unlocked) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [achievement.unlocked]);

  const color = BADGE_COLORS[index % BADGE_COLORS.length];
  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnim }],
          opacity: scaleAnim,
        },
      ]}
    >
      <View
        style={[
          styles.card,
          achievement.unlocked
            ? { borderColor: color, borderWidth: 2 }
            : { borderColor: '#2a2a3e', borderWidth: 1 },
        ]}
      >
        {achievement.unlocked && (
          <Animated.View
            style={[
              styles.glow,
              { backgroundColor: color, opacity: glowOpacity },
            ]}
          />
        )}

        <View
          style={[
            styles.iconCircle,
            {
              backgroundColor: achievement.unlocked ? color : '#2a2a3e',
            },
          ]}
        >
          <Ionicons
            name={achievement.icon as any}
            size={28}
            color={achievement.unlocked ? '#fff' : '#555'}
          />
        </View>

        <Text
          style={[
            styles.title,
            { color: achievement.unlocked ? '#fff' : '#666' },
          ]}
        >
          {achievement.title}
        </Text>

        <Text style={styles.description}>{achievement.description}</Text>

        {achievement.unlocked ? (
          <View style={[styles.unlockedBadge, { backgroundColor: color }]}>
            <Ionicons name="checkmark" size={12} color="#fff" />
            <Text style={styles.unlockedText}>Unlocked</Text>
          </View>
        ) : (
          <View style={styles.lockedBadge}>
            <Ionicons name="lock-closed" size={12} color="#666" />
            <Text style={styles.lockedText}>Locked</Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '48%',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    overflow: 'hidden',
    minHeight: 160,
  },
  glow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  description: {
    fontSize: 10,
    color: '#888',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 14,
  },
  unlockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  unlockedText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '700',
  },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: '#2a2a3e',
    gap: 4,
  },
  lockedText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '600',
  },
});
