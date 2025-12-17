import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import NoteCard from './NoteCard';

export default function NotesTab({ room }: { room: any }) {
  const router = useRouter();
  const [, setTick] = React.useState(0);

  const notes = room.notes ?? [];

  const openNew = () => {
    router.push({ pathname: '/(screens)/room/[id]/notes', params: { id: String(room.id) } });
  };

  const openEdit = (note: any) => {
    router.push({ pathname: '/(screens)/room/[id]/notes', params: { id: String(room.id), noteId: String(note.id) } });
  };

  const remove = (id: string) => {
    const updated = (room.notes || []).filter((n: any) => n.id !== id);
    room.notes = updated;
    setTick((t) => t + 1);
  };

  return (
    <View style={[styles.tabContent, styles.fill]}>
      {notes && notes.length > 0 ? (
        notes.map((n: any, index: number) => (
          <NoteCard key={n.id} note={n} index={index} onEdit={() => openEdit(n)} onDelete={() => remove(n.id)} />
        ))
      ) : (
        <View style={styles.emptyStateContainer}>
          <View style={styles.emptyIcon}>
            <ThemedText style={styles.emptyIconText}>📝</ThemedText>
          </View>
          <ThemedText style={styles.emptyTitle}>No notes yet</ThemedText>
          <ThemedText style={styles.emptyDescription}>Create a note to collaborate with your study group</ThemedText>
          <TouchableOpacity style={styles.actionButton} onPress={openNew}>
            <ThemedText style={styles.actionButtonText}>+ Create Note</ThemedText>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.fab} onPress={openNew} activeOpacity={0.8}>
        <IconSymbol name="pencil" size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContent: { paddingBottom: 20 },
  fill: { flex: 1 },
  emptyStateContainer: { paddingVertical: 60, justifyContent: 'center', alignItems: 'center' },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyIconText: { fontSize: 56 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 8 },
  emptyDescription: { fontSize: 14, color: '#999', textAlign: 'center', marginBottom: 24, maxWidth: 260 },
  actionButton: { paddingVertical: 12, paddingHorizontal: 24, backgroundColor: '#0a7ea4', borderRadius: 8, elevation: 2 },
  actionButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  fab: { position: 'absolute', right: 18, bottom: 20, width: 52, height: 52, borderRadius: 26, backgroundColor: '#0a7ea4', justifyContent: 'center', alignItems: 'center', elevation: 4 },
});
