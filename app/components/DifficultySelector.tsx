import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Difficulty, DIFFICULTY_INFO } from '../lib/gameData';

interface Props {
  selected: Difficulty;
  onSelect: (difficulty: Difficulty) => void;
}

export default function DifficultySelector({ selected, onSelect }: Props) {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Difficulty</Text>
      <View style={styles.options}>
        {difficulties.map((diff) => {
          const info = DIFFICULTY_INFO[diff];
          const isSelected = selected === diff;

          return (
            <TouchableOpacity
              key={diff}
              style={[
                styles.option,
                isSelected && { backgroundColor: info.color + '25', borderColor: info.color },
              ]}
              onPress={() => onSelect(diff)}
              activeOpacity={0.7}
            >
              <View style={styles.stars}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <Ionicons
                    key={i}
                    name={i < info.stars ? 'star' : 'star-outline'}
                    size={14}
                    color={i < info.stars ? info.color : '#444'}
                  />
                ))}
              </View>
              <Text
                style={[
                  styles.optionText,
                  isSelected && { color: info.color },
                ]}
              >
                {info.label}
              </Text>
              {isSelected && (
                <View style={[styles.checkmark, { backgroundColor: info.color }]}>
                  <Ionicons name="checkmark" size={12} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 10,
  },
  options: {
    flexDirection: 'row',
    gap: 10,
  },
  option: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#2a2a3e',
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 6,
  },
  optionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#888',
  },
  checkmark: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
