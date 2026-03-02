import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGame } from './lib/GameContext';
import { AVATARS, Difficulty, DIFFICULTY_INFO } from './lib/gameData';
import DifficultySelector from './components/DifficultySelector';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile, updateProfile, stats, resetStats } = useGame();

  const [name, setName] = useState(profile.name);
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar);
  const [soundEnabled, setSoundEnabled] = useState(profile.soundEnabled);
  const [hapticEnabled, setHapticEnabled] = useState(profile.hapticEnabled);
  const [difficulty, setDifficulty] = useState<Difficulty>(profile.preferredDifficulty);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateProfile({
      name: name.trim() || 'Player',
      avatar: selectedAvatar,
      soundEnabled,
      hapticEnabled,
      preferredDifficulty: difficulty,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Progress',
      'Are you sure you want to reset all your stats and achievements? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetStats();
            Alert.alert('Done', 'Your progress has been reset.');
          },
        },
      ]
    );
  };

  const currentAvatar = AVATARS[selectedAvatar];

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
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity
          style={[styles.saveBtn, saved && styles.savedBtn]}
          onPress={handleSave}
        >
          {saved ? (
            <Ionicons name="checkmark" size={20} color="#43e97b" />
          ) : (
            <Text style={styles.saveBtnText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <View style={styles.card}>
            {/* Avatar Preview */}
            <View style={styles.avatarPreview}>
              <View style={[styles.avatarLarge, { borderColor: currentAvatar.color }]}>
                <Ionicons
                  name={currentAvatar.icon as any}
                  size={40}
                  color={currentAvatar.color}
                />
              </View>
              <Text style={styles.avatarName}>{name || 'Player'}</Text>
            </View>

            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Display Name</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person" size={18} color="#667eea" />
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                  placeholderTextColor="#555"
                  maxLength={20}
                />
              </View>
            </View>

            {/* Avatar Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Choose Avatar</Text>
              <View style={styles.avatarGrid}>
                {AVATARS.map((avatar) => (
                  <TouchableOpacity
                    key={avatar.id}
                    style={[
                      styles.avatarOption,
                      selectedAvatar === avatar.id && {
                        borderColor: avatar.color,
                        backgroundColor: avatar.color + '15',
                      },
                    ]}
                    onPress={() => setSelectedAvatar(avatar.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={avatar.icon as any}
                      size={28}
                      color={
                        selectedAvatar === avatar.id ? avatar.color : '#666'
                      }
                    />
                    {selectedAvatar === avatar.id && (
                      <View style={[styles.avatarCheck, { backgroundColor: avatar.color }]}>
                        <Ionicons name="checkmark" size={10} color="#fff" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.card}>
            {/* Sound Toggle */}
            <View style={styles.toggleRow}>
              <View style={styles.toggleLeft}>
                <View style={[styles.toggleIcon, { backgroundColor: '#4facfe20' }]}>
                  <Ionicons name="volume-high" size={20} color="#4facfe" />
                </View>
                <View>
                  <Text style={styles.toggleLabel}>Sound Effects</Text>
                  <Text style={styles.toggleSub}>Play sounds during gameplay</Text>
                </View>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{ false: '#2a2a3e', true: '#4facfe40' }}
                thumbColor={soundEnabled ? '#4facfe' : '#666'}
              />
            </View>

            <View style={styles.separator} />

            {/* Haptic Toggle */}
            <View style={styles.toggleRow}>
              <View style={styles.toggleLeft}>
                <View style={[styles.toggleIcon, { backgroundColor: '#f093fb20' }]}>
                  <Ionicons name="phone-portrait" size={20} color="#f093fb" />
                </View>
                <View>
                  <Text style={styles.toggleLabel}>Haptic Feedback</Text>
                  <Text style={styles.toggleSub}>Vibrate on answers</Text>
                </View>
              </View>
              <Switch
                value={hapticEnabled}
                onValueChange={setHapticEnabled}
                trackColor={{ false: '#2a2a3e', true: '#f093fb40' }}
                thumbColor={hapticEnabled ? '#f093fb' : '#666'}
              />
            </View>
          </View>
        </View>

        {/* Default Difficulty */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Default Difficulty</Text>
          <View style={styles.card}>
            <DifficultySelector
              selected={difficulty}
              onSelect={setDifficulty}
            />
          </View>
        </View>

        {/* Stats Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics Summary</Text>
          <View style={styles.card}>
            <View style={styles.statsGrid}>
              <StatRow icon="checkmark-done" label="Total Solved" value={stats.totalSolved} color="#667eea" />
              <StatRow icon="thumbs-up" label="Correct Answers" value={stats.totalCorrect} color="#43e97b" />
              <StatRow icon="game-controller" label="Games Played" value={stats.totalGames} color="#4facfe" />
              <StatRow icon="star" label="Best Score" value={stats.bestScore} color="#FFD700" />
              <StatRow icon="flame" label="Best Streak" value={stats.bestStreak} color="#f5576c" />
              <StatRow icon="ribbon" label="Perfect Rounds" value={stats.perfectRounds} color="#FF9800" />
            </View>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: '#f5576c' }]}>
            Danger Zone
          </Text>
          <View style={[styles.card, { borderColor: '#f5576c30' }]}>
            <Text style={styles.dangerText}>
              Reset all your progress, stats, and achievements. This action cannot be undone.
            </Text>
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={handleReset}
              activeOpacity={0.7}
            >
              <Ionicons name="trash" size={18} color="#f5576c" />
              <Text style={styles.resetBtnText}>Reset All Progress</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Ionicons name="calculator" size={24} color="#333" />
          <Text style={styles.appInfoText}>MathBlitz v1.0</Text>
          <Text style={styles.appInfoSub}>Built for math enthusiasts</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function StatRow({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <View style={statStyles.row}>
      <View style={statStyles.left}>
        <Ionicons name={icon as any} size={16} color={color} />
        <Text style={statStyles.label}>{label}</Text>
      </View>
      <Text style={[statStyles.value, { color }]}>{value}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a3e',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 13,
    color: '#aaa',
    fontWeight: '600',
  },
  value: {
    fontSize: 15,
    fontWeight: '800',
  },
});

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
  saveBtn: {
    backgroundColor: '#667eea',
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  savedBtn: {
    backgroundColor: '#43e97b20',
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  avatarPreview: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 28,
    backgroundColor: '#0d0d1a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    marginBottom: 8,
  },
  avatarName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0d0d1a',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  avatarOption: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#0d0d1a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2a2a3e',
  },
  avatarCheck: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  toggleIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  toggleSub: {
    fontSize: 11,
    color: '#888',
    fontWeight: '500',
    marginTop: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#2a2a3e',
    marginVertical: 12,
  },
  statsGrid: {
    gap: 2,
  },
  dangerText: {
    fontSize: 13,
    color: '#888',
    lineHeight: 18,
    marginBottom: 14,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#f5576c15',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#f5576c30',
  },
  resetBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f5576c',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 4,
  },
  appInfoText: {
    fontSize: 14,
    color: '#444',
    fontWeight: '700',
  },
  appInfoSub: {
    fontSize: 11,
    color: '#333',
    fontWeight: '500',
  },
});
