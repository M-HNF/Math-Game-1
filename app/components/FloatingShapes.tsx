import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SHAPES = [
  { symbol: '+', color: '#667eea', size: 32 },
  { symbol: '−', color: '#f5576c', size: 28 },
  { symbol: '×', color: '#4facfe', size: 30 },
  { symbol: '÷', color: '#43e97b', size: 26 },
  { symbol: '=', color: '#f093fb', size: 24 },
  { symbol: '%', color: '#FF9800', size: 22 },
  { symbol: '3', color: '#764ba2', size: 34 },
  { symbol: '7', color: '#00f2fe', size: 28 },
  { symbol: '9', color: '#f5576c', size: 30 },
  { symbol: '5', color: '#43e97b', size: 26 },
];

export default function FloatingShapes() {
  const anims = useRef(
    SHAPES.map(() => ({
      y: new Animated.Value(0),
      x: new Animated.Value(0),
      rotate: new Animated.Value(0),
      opacity: new Animated.Value(0.12),
    }))
  ).current;

  useEffect(() => {
    anims.forEach((anim, i) => {
      const duration = 3000 + i * 500;

      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(anim.y, {
              toValue: -15 - Math.random() * 20,
              duration,
              useNativeDriver: true,
            }),
            Animated.timing(anim.y, {
              toValue: 15 + Math.random() * 20,
              duration,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(anim.x, {
              toValue: 10 + Math.random() * 10,
              duration: duration * 0.8,
              useNativeDriver: true,
            }),
            Animated.timing(anim.x, {
              toValue: -10 - Math.random() * 10,
              duration: duration * 0.8,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(anim.rotate, {
              toValue: 1,
              duration: duration * 2,
              useNativeDriver: true,
            }),
            Animated.timing(anim.rotate, {
              toValue: 0,
              duration: duration * 2,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    });
  }, []);

  return (
    <View style={styles.container} pointerEvents="none">
      {SHAPES.map((shape, i) => {
        const spin = anims[i].rotate.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        });

        const left = (i * SCREEN_WIDTH * 0.18) % (SCREEN_WIDTH - 40);
        const top = 40 + (i * 70) % 250;

        return (
          <Animated.View
            key={i}
            style={[
              styles.shape,
              {
                left,
                top,
                transform: [
                  { translateY: anims[i].y },
                  { translateX: anims[i].x },
                  { rotate: spin },
                ],
                opacity: anims[i].opacity,
              },
            ]}
          >
            <Text style={[styles.symbol, { fontSize: shape.size, color: shape.color }]}>
              {shape.symbol}
            </Text>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  shape: {
    position: 'absolute',
  },
  symbol: {
    fontWeight: '900',
  },
});
