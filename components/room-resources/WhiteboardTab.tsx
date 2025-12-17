import { ThemedText } from '@/components/themed-text';
import React from 'react';
import { Modal, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import WhiteboardCard from './WhiteboardCard';
import { IconSymbol } from '../ui/icon-symbol';

export default function WhiteboardTab({ room }: { room: any }) {
  const [boards, setBoards] = React.useState(room.whiteboards ?? []);
  const [showNew, setShowNew] = React.useState(false);
  const [title, setTitle] = React.useState('');

  const create = () => {
    const nb = { id: `w${Date.now()}`, title: title || 'Untitled' };
    const updated = [nb, ...boards];
    setBoards(updated);
    room.whiteboards = updated;
    setShowNew(false);
  };

  return (
    <View style={[styles.tabContent, styles.fill]}>
      {boards && boards.length > 0 ? (
        boards.map((w: any, index: number) => <WhiteboardCard key={w.id} whiteboard={w} index={index} />)
      ) : (
        <View style={styles.emptyStateContainer}>
          <View style={styles.emptyIcon}>
            <ThemedText style={styles.emptyIconText}>✏️</ThemedText>
          </View>
          <ThemedText style={styles.emptyTitle}>No whiteboards yet</ThemedText>
          <ThemedText style={styles.emptyDescription}>Create a whiteboard to sketch and brainstorm together</ThemedText>
          <TouchableOpacity style={styles.actionButton} onPress={() => setShowNew(true)}>
            <ThemedText style={styles.actionButtonText}>+ New Whiteboard</ThemedText>
          </TouchableOpacity>
        </View>
      )}

      <Modal visible={showNew} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText type="defaultSemiBold" style={{ fontSize: 18, marginBottom: 8 }}>New Whiteboard</ThemedText>
            <TextInput value={title} onChangeText={setTitle} placeholder="Canvas title" style={styles.input} />
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
              <TouchableOpacity style={[styles.actionButton, { flex: 1 }]} onPress={() => setShowNew(false)}>
                <ThemedText style={styles.actionButtonText}>Cancel</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.createButton, { flex: 1 }]} onPress={create}>
                <ThemedText style={styles.createButtonText}>Create</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.fab} onPress={create} activeOpacity={0.8}>
        <IconSymbol name="plus" size={18} color="#fff" />
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
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fff' },
  createButton: { marginTop: 20, backgroundColor: '#0a7ea4', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  createButtonText: { color: '#fff', fontWeight: '700' },
  fab: { position: 'absolute', right: 18, bottom: 20, width: 52, height: 52, borderRadius: 26, backgroundColor: '#0a7ea4', justifyContent: 'center', alignItems: 'center', elevation: 4 },
});
