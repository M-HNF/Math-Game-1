import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GameModeInfo } from '../lib/gameData';

interface Props {
  mode: GameModeInfo;
  gamesPlayed: number;
  index: number;
  onPress: () => void;
}

export default function GameModeCard({ mode, gamesPlayed, index, onPress }: Props) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      delay: index * 150,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2000 + index * 300,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000 + index * 300,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -6],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnim }, { translateY }],
          opacity: scaleAnim,
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.card, { backgroundColor: mode.gradient[0] }]}
        onPress={onPress}
        activeOpacity={0.85}
      >
        <View style={[styles.gradientOverlay, { backgroundColor: mode.gradient[1] }]} />
        
        {/* Decorative circles */}
        <View style={[styles.decorCircle, styles.decorCircle1, { backgroundColor: mode.gradient[1] }]} />
        <View style={[styles.decorCircle, styles.decorCircle2, { backgroundColor: mode.gradient[0] }]} />
        
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name={mode.icon as any} size={36} color="rgba(255,255,255,0.95)" />
          </View>
          
          <Text style={styles.symbol}>{mode.symbol}</Text>
          
          <Text style={styles.title}>{mode.title}</Text>
          <Text style={styles.subtitle}>{mode.subtitle}</Text>
          
          {gamesPlayed > 0 && (
            <View style={styles.badge}>
              <Ionicons name="game-controller" size={12} color="#fff" />
              <Text style={styles.badgeText}>{gamesPlayed} played</Text>
            </View>
          )}
        </View>
        
        <View style={styles.playButton}>
          <Ionicons name="play" size={20} color={mode.gradient[0]} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '48%',
    marginBottom: 16,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    minHeight: 190,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  gradientOverlay: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  decorCircle: {
    position: 'absolute',
    borderRadius: 100,
    opacity: 0.15,
  },
  decorCircle1: {
    width: 80,
    height: 80,
    top: -20,
    right: -20,
  },
  decorCircle2: {
    width: 60,
    height: 60,
    bottom: 20,
    left: -15,
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  symbol: {
    position: 'absolute',
    top: 8,
    right: 4,
    fontSize: 28,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.25)',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginTop: 10,
    gap: 4,
  },
  badgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  playButton: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
