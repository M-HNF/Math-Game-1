import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { GameProvider, useGame } from './lib/GameContext';

function LoadingScreen() {
  const pulseAnim = useRef(new Animated.Value(0.6)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const dotsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.6,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(dotsAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(dotsAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={loadingStyles.container}>
      {/* Decorative floating symbols */}
      <Animated.Text
        style={[
          loadingStyles.floatingSymbol,
          { top: '15%', left: '10%', color: '#667eea30' },
          { transform: [{ rotate: spin }] },
        ]}
      >
        +
      </Animated.Text>
      <Animated.Text
        style={[
          loadingStyles.floatingSymbol,
          { top: '25%', right: '15%', color: '#f5576c30', fontSize: 40 },
          { transform: [{ rotate: spin }] },
        ]}
      >
        ×
      </Animated.Text>
      <Animated.Text
        style={[
          loadingStyles.floatingSymbol,
          { bottom: '30%', left: '20%', color: '#43e97b30', fontSize: 36 },
          { transform: [{ rotate: spin }] },
        ]}
      >
        ÷
      </Animated.Text>
      <Animated.Text
        style={[
          loadingStyles.floatingSymbol,
          { bottom: '20%', right: '12%', color: '#4facfe30' },
          { transform: [{ rotate: spin }] },
        ]}
      >
        −
      </Animated.Text>

      {/* Main content */}
      <Animated.View style={[loadingStyles.iconWrap, { opacity: pulseAnim, transform: [{ scale: pulseAnim }] }]}>
        <View style={loadingStyles.iconCircle}>
          <Ionicons name="calculator" size={48} color="#fff" />
        </View>
      </Animated.View>

      <Text style={loadingStyles.title}>MathBlitz</Text>
      <Animated.Text style={[loadingStyles.subtitle, { opacity: dotsAnim }]}>
        Loading your progress...
      </Animated.Text>

      {/* Progress bar */}
      <View style={loadingStyles.progressTrack}>
        <Animated.View
          style={[
            loadingStyles.progressBar,
            {
              transform: [
                {
                  scaleX: pulseAnim.interpolate({
                    inputRange: [0.6, 1],
                    outputRange: [0.3, 1],
                  }),
                },
              ],
            },
          ]}
        />
      </View>
    </View>
  );
}

function AppContent() {
  const { isLoaded } = useGame();

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0d0d1a' },
        animation: 'slide_from_right',
      }}
    />
  );
}

export default function RootLayout() {
  return (
    <GameProvider>
      <StatusBar style="light" />
      <AppContent />
    </GameProvider>
  );
}

const loadingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingSymbol: {
    position: 'absolute',
    fontSize: 48,
    fontWeight: '900',
  },
  iconWrap: {
    marginBottom: 20,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 30,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    fontWeight: '600',
    marginBottom: 32,
  },
  progressTrack: {
    width: 180,
    height: 4,
    backgroundColor: '#1a1a2e',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#667eea',
    borderRadius: 2,
    transformOrigin: 'left',
  },
});
