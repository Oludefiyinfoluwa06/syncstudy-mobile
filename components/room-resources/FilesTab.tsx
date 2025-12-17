import { ThemedText } from '@/components/themed-text';
import * as DocumentPicker from 'expo-document-picker';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function FilesTab({ room }: { room: any }) {
  const [files, setFiles] = React.useState(room.files ?? []);
  React.useEffect(() => {
    setFiles(room.files ?? []);
  }, [room]);

  const pickFile = async () => {
    try {
      const res: any = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: false });
      if (res.type === 'success') {
        const f = { id: `f${Date.now()}`, name: res.name || res.uri.split('/').pop(), url: res.uri };
        const updated = [f, ...(room.files || [])];
        room.files = updated;
        setFiles(updated);
      }
    } catch (e) {
      console.warn('Document pick error', e);
    }
  };

  const removeFile = (id: string) => {
    const updated = (room.files || []).filter((x: any) => x.id !== id);
    room.files = updated;
    setFiles(updated);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.fileRow}>
      <View style={{ flex: 1 }}>
        <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
        {item.url ? <Text style={styles.fileUrl} numberOfLines={1}>{item.url}</Text> : null}
      </View>
      <TouchableOpacity onPress={() => removeFile(item.id)} style={{ padding: 8 }}>
        <ThemedText style={{ color: '#e34' }}>Remove</ThemedText>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.tabContent, styles.fill]}>
      {files && files.length > 0 ? (
        <FlatList data={files} keyExtractor={(i) => i.id} renderItem={renderItem} contentContainerStyle={{ paddingBottom: 40 }} />
      ) : (
        <View style={styles.emptyStateContainer}>
          <View style={styles.emptyIcon}>
            <ThemedText style={styles.emptyIconText}>📁</ThemedText>
          </View>
          <ThemedText style={styles.emptyTitle}>No files yet</ThemedText>
          <ThemedText style={styles.emptyDescription}>Upload or link files here to share with the room</ThemedText>
          <TouchableOpacity style={styles.actionButton} onPress={pickFile}>
            <ThemedText style={styles.actionButtonText}>+ Upload File</ThemedText>
          </TouchableOpacity>
        </View>
      )}
      {/* Document picker used for file selection */}
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
  fileRow: { flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 12, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  fileUrl: { fontSize: 12, color: '#888', marginTop: 4 },
});
