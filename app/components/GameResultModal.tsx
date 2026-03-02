import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  visible: boolean;
  score: number;
  correct: number;
  total: number;
  streak: number;
  newAchievements: string[];
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export default function GameResultModal({
  visible,
  score,
  correct,
  total,
  streak,
  newAchievements,
  onPlayAgain,
  onGoHome,
}: Props) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const scoreAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0);
      scoreAnim.setValue(0);

      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();

      Animated.timing(scoreAnim, {
        toValue: score,
        duration: 1500,
        useNativeDriver: false,
      }).start();
    }
  }, [visible, score]);

  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const isPerfect = correct === total && total > 0;

  const getGrade = () => {
    if (accuracy >= 95) return { letter: 'S', color: '#FFD700' };
    if (accuracy >= 85) return { letter: 'A', color: '#43e97b' };
    if (accuracy >= 70) return { letter: 'B', color: '#4facfe' };
    if (accuracy >= 50) return { letter: 'C', color: '#FF9800' };
    return { letter: 'D', color: '#f5576c' };
  };

  const grade = getGrade();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modal,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            {isPerfect ? (
              <Ionicons name="trophy" size={48} color="#FFD700" />
            ) : (
              <Ionicons name="flag" size={48} color="#667eea" />
            )}
            <Text style={styles.title}>
              {isPerfect ? 'PERFECT!' : 'Time\'s Up!'}
            </Text>
          </View>

          {/* Grade */}
          <View style={[styles.gradeCircle, { borderColor: grade.color }]}>
            <Text style={[styles.gradeText, { color: grade.color }]}>{grade.letter}</Text>
          </View>

          {/* Score */}
          <Text style={styles.scoreLabel}>Score</Text>
          <Text style={styles.scoreValue}>{score}</Text>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Ionicons name="checkmark-circle" size={22} color="#43e97b" />
              <Text style={styles.statBoxValue}>{correct}/{total}</Text>
              <Text style={styles.statBoxLabel}>Correct</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="analytics" size={22} color="#4facfe" />
              <Text style={styles.statBoxValue}>{accuracy}%</Text>
              <Text style={styles.statBoxLabel}>Accuracy</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="flame" size={22} color="#f5576c" />
              <Text style={styles.statBoxValue}>{streak}</Text>
              <Text style={styles.statBoxLabel}>Best Streak</Text>
            </View>
          </View>

          {/* New Achievements */}
          {newAchievements.length > 0 && (
            <View style={styles.achievementSection}>
              <Text style={styles.achievementTitle}>
                <Ionicons name="medal" size={16} color="#FFD700" /> New Achievements!
              </Text>
              {newAchievements.map((name, i) => (
                <View key={i} style={styles.achievementItem}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.achievementName}>{name}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Buttons */}
          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.playAgainBtn}
              onPress={onPlayAgain}
              activeOpacity={0.8}
            >
              <Ionicons name="refresh" size={20} color="#fff" />
              <Text style={styles.playAgainText}>Play Again</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.homeBtn}
              onPress={onGoHome}
              activeOpacity={0.8}
            >
              <Ionicons name="home" size={20} color="#667eea" />
              <Text style={styles.homeText}>Home</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modal: {
    backgroundColor: '#16162a',
    borderRadius: 24,
    padding: 28,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#fff',
    marginTop: 8,
  },
  gradeCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  gradeText: {
    fontSize: 32,
    fontWeight: '900',
  },
  scoreLabel: {
    fontSize: 13,
    color: '#888',
    fontWeight: '600',
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '900',
    color: '#667eea',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
    width: '100%',
  },
  statBox: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  statBoxValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },
  statBoxLabel: {
    fontSize: 10,
    color: '#888',
    fontWeight: '600',
  },
  achievementSection: {
    backgroundColor: '#1a1a2e',
    borderRadius: 14,
    padding: 14,
    width: '100%',
    marginBottom: 20,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFD700',
    marginBottom: 8,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  achievementName: {
    fontSize: 13,
    color: '#ddd',
    fontWeight: '600',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  playAgainBtn: {
    flex: 1,
    backgroundColor: '#667eea',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  playAgainText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  homeBtn: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#667eea',
  },
  homeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#667eea',
  },
});
