import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CONFETTI_COLORS = [
  '#667eea', '#f5576c', '#4facfe', '#43e97b',
  '#f093fb', '#FF9800', '#764ba2', '#00f2fe',
  '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1',
];

interface ConfettiPiece {
  x: Animated.Value;
  y: Animated.Value;
  rotate: Animated.Value;
  opacity: Animated.Value;
  color: string;
  size: number;
  isCircle: boolean;
  startX: number;
}

interface Props {
  active: boolean;
  count?: number;
}

export default function ConfettiEffect({ active, count = 30 }: Props) {
  const pieces = useRef<ConfettiPiece[]>([]);

  if (pieces.current.length === 0) {
    pieces.current = Array.from({ length: count }).map(() => {
      const startX = Math.random() * SCREEN_WIDTH;
      return {
        x: new Animated.Value(startX),
        y: new Animated.Value(-50),
        rotate: new Animated.Value(0),
        opacity: new Animated.Value(0),
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        size: Math.random() * 8 + 4,
        isCircle: Math.random() > 0.5,
        startX,
      };
    });
  }

  useEffect(() => {
    if (active) {
      pieces.current.forEach((piece, i) => {
        const newStartX = Math.random() * SCREEN_WIDTH;
        piece.startX = newStartX;
        piece.x.setValue(newStartX);
        piece.y.setValue(-50);
        piece.opacity.setValue(1);
        piece.rotate.setValue(0);

        const duration = 1500 + Math.random() * 1000;

        Animated.parallel([
          Animated.timing(piece.y, {
            toValue: SCREEN_HEIGHT + 50,
            duration,
            delay: i * 30,
            useNativeDriver: true,
          }),
          Animated.timing(piece.x, {
            toValue: newStartX + (Math.random() - 0.5) * 200,
            duration,
            delay: i * 30,
            useNativeDriver: true,
          }),
          Animated.timing(piece.rotate, {
            toValue: Math.random() * 10,
            duration,
            delay: i * 30,
            useNativeDriver: true,
          }),
          Animated.timing(piece.opacity, {
            toValue: 0,
            duration,
            delay: i * 30 + duration * 0.7,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }
  }, [active]);

  if (!active) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {pieces.current.map((piece, i) => {
        const spin = piece.rotate.interpolate({
          inputRange: [0, 10],
          outputRange: ['0deg', '3600deg'],
        });

        return (
          <Animated.View
            key={i}
            style={[
              styles.piece,
              {
                width: piece.size,
                height: piece.isCircle ? piece.size : piece.size * 2,
                backgroundColor: piece.color,
                borderRadius: piece.isCircle ? piece.size / 2 : 2,
                transform: [
                  { translateX: piece.x },
                  { translateY: piece.y },
                  { rotate: spin },
                ],
                opacity: piece.opacity,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  piece: {
    position: 'absolute',
  },
});
