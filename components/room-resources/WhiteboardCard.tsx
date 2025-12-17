import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';
import React from 'react';
import { Animated, Easing, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function WhiteboardCard({ whiteboard, index }: { whiteboard: any; index: number }) {
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, { toValue: 1, duration: 400, delay: index * 50, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 400, delay: index * 50, useNativeDriver: true }),
    ]).start();
  }, [index, scaleAnim, opacityAnim]);

  const router = useRouter();

  return (
    <Animated.View style={[styles.whiteboardRow, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}>
      <TouchableOpacity
        style={styles.whiteboardCard}
        activeOpacity={0.8}
        onPress={() => router.push({ pathname: '/(screens)/room/[id]/whiteboard', params: { id: String(whiteboard.id) } })}
      >
        <View style={styles.whiteboardPreview}>
          <ThemedText style={styles.whiteboardPreviewIcon}>🎨</ThemedText>
        </View>
        <View style={styles.whiteboardInfo}>
          <ThemedText type="defaultSemiBold" style={styles.whiteboardTitle}>{whiteboard.title}</ThemedText>
          <ThemedText style={styles.whiteboardMeta}>Collaborative canvas</ThemedText>
        </View>
        <ThemedText style={styles.whiteboardArrow}>→</ThemedText>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  whiteboardRow: { marginBottom: 12 },
  whiteboardCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 14, backgroundColor: '#fff', borderRadius: 10, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 0.5 }, shadowOpacity: 0.05, shadowRadius: 2, gap: 12 },
  whiteboardPreview: { width: 50, height: 50, borderRadius: 8, backgroundColor: '#f5e6d3', justifyContent: 'center', alignItems: 'center' },
  whiteboardPreviewIcon: { fontSize: 24 },
  whiteboardInfo: { flex: 1 },
  whiteboardTitle: { fontSize: 14, fontWeight: '700' },
  whiteboardMeta: { fontSize: 12, color: '#999', marginTop: 2 },
  whiteboardArrow: { fontSize: 16, color: '#0a7ea4' },
});
