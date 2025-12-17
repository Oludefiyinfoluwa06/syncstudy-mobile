import React from 'react';
import { Animated, Easing, View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';

export default function NoteCard({ note, index, onEdit, onDelete }: { note: any; index: number; onEdit?: () => void; onDelete?: () => void }) {
  const slideAnim = React.useRef(new Animated.Value(20)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 50,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, slideAnim, opacityAnim]);

  return (
    <Animated.View style={[styles.noteRow, { transform: [{ translateY: slideAnim }], opacity: opacityAnim }]}>
      <View style={styles.noteCardContent}>
        <View style={styles.noteIcon}>
          <ThemedText>📄</ThemedText>
        </View>
        <View style={{ flex: 1 }}>
          <ThemedText type="defaultSemiBold" style={styles.noteTitle}>{note.title}</ThemedText>
          <ThemedText style={styles.notePreview} numberOfLines={2}>{note.content}</ThemedText>
        </View>
        <View style={{ flexDirection: 'row', gap: 8, marginLeft: 8 }}>
          {onEdit && (
            <TouchableOpacity onPress={onEdit} style={{ padding: 8 }}>
              <IconSymbol name="pencil" size={16} color={Colors.light.tint} />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity onPress={onDelete} style={{ padding: 8 }}>
              <IconSymbol name="trash" size={16} color="#e34" />
            </TouchableOpacity>
          )}
          <View style={styles.noteArrowWrap}>
            <IconSymbol name="chevron.right" size={18} color={Colors.light.tint} />
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  noteRow: { marginBottom: 12 },
  noteCardContent: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 14, backgroundColor: '#fff', borderRadius: 10, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 0.5 }, shadowOpacity: 0.05, shadowRadius: 2, gap: 12 },
  noteIcon: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#f0f7ff', justifyContent: 'center', alignItems: 'center', fontSize: 20 },
  noteTitle: { fontSize: 14, fontWeight: '700' },
  notePreview: { fontSize: 12, color: '#999', marginTop: 2, lineHeight: 16 },
  noteArrowWrap: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#f0f7ff', justifyContent: 'center', alignItems: 'center' },
});
