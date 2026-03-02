import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useGame } from './lib/GameContext';
import {
  GameMode,
  Difficulty,
  GAME_MODES,
  GAME_DURATION,
  DIFFICULTY_INFO,
  generateProblem,
  generateChoices,
  getScoreMultiplier,
} from './lib/gameData';
import ConfettiEffect from './components/ConfettiEffect';
import GameResultModal from './components/GameResultModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function GameScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ mode: string; difficulty: string }>();
  const { profile, achievements, recordGameResult } = useGame();

  const mode = (params.mode || 'addition') as GameMode;
  const difficulty = (params.difficulty || 'easy') as Difficulty;
  const modeInfo = GAME_MODES.find((m) => m.id === mode) || GAME_MODES[0];
  const diffInfo = DIFFICULTY_INFO[difficulty];
  const multiplier = getScoreMultiplier(difficulty);

  // Game state
  const [gameState, setGameState] = useState<'countdown' | 'playing' | 'finished'>('countdown');
  const [countdownValue, setCountdownValue] = useState(3);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [problem, setProblem] = useState(() => generateProblem(mode, difficulty));
  const [choices, setChoices] = useState(() => generateChoices(problem.answer));
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState<boolean | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [newAchievements, setNewAchievements] = useState<string[]>([]);
  const [comboText, setComboText] = useState('');

  // Animations
  const countdownAnim = useRef(new Animated.Value(0)).current;
  const questionAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const scorePopAnim = useRef(new Animated.Value(0)).current;
  const timerWidthAnim = useRef(new Animated.Value(100)).current;
  const comboAnim = useRef(new Animated.Value(0)).current;

  const prevAchievements = useRef(achievements.filter((a) => a.unlocked).map((a) => a.title));

  // Countdown
  useEffect(() => {
    if (gameState === 'countdown') {
      const interval = setInterval(() => {
        setCountdownValue((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setGameState('playing');
            return 0;
          }
          return prev - 1;
        });

        Animated.sequence([
          Animated.timing(countdownAnim, {
            toValue: 1.3,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(countdownAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      }, 1000);

      Animated.timing(countdownAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      return () => clearInterval(interval);
    }
  }, [gameState]);

  // Game timer
  useEffect(() => {
    if (gameState === 'playing') {
      Animated.timing(timerWidthAnim, {
        toValue: 0,
        duration: GAME_DURATION * 1000,
        useNativeDriver: false,
      }).start();

      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setGameState('finished');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Animate first question in
      Animated.spring(questionAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();

      return () => clearInterval(interval);
    }
  }, [gameState]);

  // Handle game finish

  useEffect(() => {
    if (gameState === 'finished') {
      const finalScore = score;
      recordGameResult(mode, difficulty, correct, total, finalScore, bestStreak);

      // Check for new achievements
      setTimeout(() => {
        const currentUnlocked = achievements
          .filter((a) => a.unlocked)
          .map((a) => a.title);
        const newOnes = currentUnlocked.filter(
          (t) => !prevAchievements.current.includes(t)
        );
        setNewAchievements(newOnes);
        setShowResult(true);
      }, 500);
    }
  }, [gameState]);


  const nextProblem = useCallback(() => {
    const newProblem = generateProblem(mode, difficulty);
    setProblem(newProblem);
    setChoices(generateChoices(newProblem.answer));
    setSelectedAnswer(null);
    setIsCorrectAnswer(null);

    questionAnim.setValue(0);
    Animated.spring(questionAnim, {
      toValue: 1,
      tension: 60,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [mode, difficulty]);

  const handleAnswer = useCallback(
    (answer: number) => {
      if (selectedAnswer !== null || gameState !== 'playing') return;

      setSelectedAnswer(answer);
      const isCorrect = answer === problem.answer;
      setIsCorrectAnswer(isCorrect);
      setTotal((prev) => prev + 1);

      if (isCorrect) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        setBestStreak((prev) => Math.max(prev, newStreak));

        // Score calculation with streak bonus
        const streakBonus = Math.min(newStreak - 1, 5);
        const points = (10 + streakBonus * 2) * multiplier;
        setScore((prev) => prev + points);
        setCorrect((prev) => prev + 1);

        // Combo text
        if (newStreak >= 3) {
          const combos = ['Nice!', 'Great!', 'Amazing!', 'Incredible!', 'UNSTOPPABLE!'];
          const comboIdx = Math.min(Math.floor((newStreak - 3) / 2), combos.length - 1);
          setComboText(combos[comboIdx]);
          comboAnim.setValue(0);
          Animated.sequence([
            Animated.timing(comboAnim, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.delay(600),
            Animated.timing(comboAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start();
        }

        // Score pop animation
        scorePopAnim.setValue(0);
        Animated.sequence([
          Animated.timing(scorePopAnim, {
            toValue: 1.3,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(scorePopAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start();

        if (newStreak >= 5 && newStreak % 5 === 0) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 2000);
        }

        if (profile.hapticEnabled) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      } else {
        setStreak(0);

        // Shake animation
        Animated.sequence([
          Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 8, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: -8, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]).start();

        if (profile.hapticEnabled) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
      }

      // Next problem after delay
      setTimeout(() => {
        nextProblem();
      }, 600);
    },
    [selectedAnswer, gameState, problem, streak, multiplier, profile.hapticEnabled, nextProblem]
  );

  const handlePlayAgain = () => {
    setShowResult(false);
    setScore(0);
    setCorrect(0);
    setTotal(0);
    setStreak(0);
    setBestStreak(0);
    setTimeLeft(GAME_DURATION);
    setCountdownValue(3);
    setGameState('countdown');
    timerWidthAnim.setValue(100);
    prevAchievements.current = achievements.filter((a) => a.unlocked).map((a) => a.title);
    nextProblem();
  };

  const handleGoHome = () => {
    setShowResult(false);
    router.back();
  };

  const timerWidth = timerWidthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const timerColor =
    timeLeft > 30 ? '#43e97b' : timeLeft > 10 ? '#FF9800' : '#f5576c';

  // Countdown screen
  if (gameState === 'countdown') {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.countdownContainer}>
          <Text style={styles.countdownModeTitle}>{modeInfo.title}</Text>
          <Text style={styles.countdownDifficulty}>{diffInfo.label}</Text>
          <Animated.View
            style={[
              styles.countdownCircle,
              {
                transform: [{ scale: countdownAnim }],
                borderColor: modeInfo.gradient[0],
              },
            ]}
          >
            <Text style={[styles.countdownNumber, { color: modeInfo.gradient[0] }]}>
              {countdownValue || 'GO!'}
            </Text>
          </Animated.View>
          <Text style={styles.countdownHint}>Get ready...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ConfettiEffect active={showConfetti} />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.topCenter}>
          <Text style={styles.modeLabel}>{modeInfo.title}</Text>
          <View style={styles.diffBadge}>
            <Text style={[styles.diffBadgeText, { color: diffInfo.color }]}>
              {diffInfo.label}
            </Text>
          </View>
        </View>

        <Animated.View style={{ transform: [{ scale: scorePopAnim.interpolate({ inputRange: [0, 1, 1.3], outputRange: [1, 1, 1.3] }) }] }}>
          <View style={styles.scoreContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.scoreText}>{score}</Text>
          </View>
        </Animated.View>
      </View>

      {/* Timer Bar */}
      <View style={styles.timerBar}>
        <Animated.View
          style={[
            styles.timerFill,
            { width: timerWidth, backgroundColor: timerColor },
          ]}
        />
      </View>

      {/* Timer & Streak Info */}
      <View style={styles.infoRow}>
        <View style={styles.timerDisplay}>
          <Ionicons name="time" size={18} color={timerColor} />
          <Text style={[styles.timerText, { color: timerColor }]}>
            {timeLeft}s
          </Text>
        </View>
        {streak >= 2 && (
          <View style={styles.streakDisplay}>
            <Ionicons name="flame" size={18} color="#f5576c" />
            <Text style={styles.streakText}>{streak}x</Text>
          </View>
        )}
        <View style={styles.progressDisplay}>
          <Text style={styles.progressText}>
            {correct}/{total}
          </Text>
        </View>
      </View>

      {/* Combo Text */}
      <Animated.View
        style={[
          styles.comboContainer,
          {
            opacity: comboAnim,
            transform: [
              {
                scale: comboAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.comboText}>{comboText}</Text>
      </Animated.View>

      {/* Question */}
      <Animated.View
        style={[
          styles.questionContainer,
          {
            opacity: questionAnim,
            transform: [
              {
                translateX: shakeAnim,
              },
              {
                scale: questionAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
          },
        ]}
      >
        <View style={[styles.questionCard, { borderColor: modeInfo.gradient[0] + '40' }]}>
          <Text style={styles.questionText}>
            {problem.num1}{' '}
            <Text style={[styles.operatorText, { color: modeInfo.gradient[0] }]}>
              {modeInfo.symbol}
            </Text>{' '}
            {problem.num2}
          </Text>
          <Text style={styles.equalsText}>=</Text>
          <Text style={styles.questionMark}>?</Text>
        </View>
      </Animated.View>

      {/* Answer Choices */}
      <View style={styles.choicesGrid}>
        {choices.map((choice, index) => {
          const isSelected = selectedAnswer === choice;
          const isCorrectChoice = choice === problem.answer;
          let bgColor = modeInfo.gradient[0] + '15';
          let borderColor = modeInfo.gradient[0] + '30';
          let textColor = '#fff';

          if (selectedAnswer !== null) {
            if (isCorrectChoice) {
              bgColor = '#43e97b25';
              borderColor = '#43e97b';
              textColor = '#43e97b';
            } else if (isSelected && !isCorrectAnswer) {
              bgColor = '#f5576c25';
              borderColor = '#f5576c';
              textColor = '#f5576c';
            }
          }

          return (
            <TouchableOpacity
              key={`${choice}-${index}`}
              style={[
                styles.choiceBtn,
                {
                  backgroundColor: bgColor,
                  borderColor: borderColor,
                },
              ]}
              onPress={() => handleAnswer(choice)}
              activeOpacity={0.7}
              disabled={selectedAnswer !== null}
            >
              <Text style={[styles.choiceText, { color: textColor }]}>
                {choice}
              </Text>
              {selectedAnswer !== null && isCorrectChoice && (
                <View style={styles.correctIcon}>
                  <Ionicons name="checkmark-circle" size={24} color="#43e97b" />
                </View>
              )}
              {isSelected && !isCorrectAnswer && selectedAnswer !== null && (
                <View style={styles.correctIcon}>
                  <Ionicons name="close-circle" size={24} color="#f5576c" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Multiplier Badge */}
      {multiplier > 1 && (
        <View style={styles.multiplierBadge}>
          <Ionicons name="trending-up" size={14} color="#FFD700" />
          <Text style={styles.multiplierText}>{multiplier}x Points</Text>
        </View>
      )}

      <GameResultModal
        visible={showResult}
        score={score}
        correct={correct}
        total={total}
        streak={bestStreak}
        newAchievements={newAchievements}
        onPlayAgain={handlePlayAgain}
        onGoHome={handleGoHome}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d1a',
  },
  countdownContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownModeTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  countdownDifficulty: {
    fontSize: 14,
    color: '#888',
    fontWeight: '600',
    marginBottom: 40,
  },
  countdownCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  countdownNumber: {
    fontSize: 60,
    fontWeight: '900',
  },
  countdownHint: {
    fontSize: 16,
    color: '#666',
    marginTop: 30,
    fontWeight: '600',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topCenter: {
    alignItems: 'center',
  },
  modeLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  diffBadge: {
    marginTop: 2,
  },
  diffBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFD700',
  },
  timerBar: {
    height: 5,
    backgroundColor: '#1a1a2e',
    marginHorizontal: 16,
    borderRadius: 3,
    overflow: 'hidden',
  },
  timerFill: {
    height: '100%',
    borderRadius: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  timerDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timerText: {
    fontSize: 16,
    fontWeight: '800',
  },
  streakDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5576c20',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#f5576c',
  },
  progressDisplay: {
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#aaa',
  },
  comboContainer: {
    position: 'absolute',
    top: '25%',
    alignSelf: 'center',
    zIndex: 10,
  },
  comboText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFD700',
    textShadowColor: 'rgba(255, 215, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  questionCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
  },
  questionText: {
    fontSize: 52,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 2,
  },
  operatorText: {
    fontSize: 52,
    fontWeight: '900',
  },
  equalsText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#555',
    marginTop: 8,
  },
  questionMark: {
    fontSize: 44,
    fontWeight: '900',
    color: '#667eea',
    marginTop: 4,
  },
  choicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
    justifyContent: 'center',
  },
  choiceBtn: {
    width: (SCREEN_WIDTH - 56) / 2,
    paddingVertical: 20,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    position: 'relative',
  },
  choiceText: {
    fontSize: 28,
    fontWeight: '900',
  },
  correctIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  multiplierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingBottom: 16,
  },
  multiplierText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFD700',
  },
});
