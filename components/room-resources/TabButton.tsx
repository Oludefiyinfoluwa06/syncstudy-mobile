import { ThemedText } from '@/components/themed-text';
import React from 'react';
import { Animated, StyleSheet, TouchableOpacity } from 'react-native';

export default function TabButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.tab, active && styles.tabActive]}
      >
        <ThemedText type={active ? 'defaultSemiBold' : 'default'} style={[styles.tabText, active && styles.tabTextActive]}>
          {label}
        </ThemedText>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tab: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, backgroundColor: '#f0f0f0' },
  tabActive: { backgroundColor: '#f0f7ff', borderWidth: 1.5, borderColor: '#0a7ea4' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#666' },
  tabTextActive: { color: '#0a7ea4' },
});
