import FilesTab from '@/components/room-resources/FilesTab';
import NotesTab from '@/components/room-resources/NotesTab';
import TabButton from '@/components/room-resources/TabButton';
import WhiteboardTab from '@/components/room-resources/WhiteboardTab';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { rooms } from '@/data';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type TabType = 'files' | 'notes' | 'whiteboard';

export default function RoomResources() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const room = rooms.find((r) => r.id === id);
  const [tab, setTab] = React.useState<TabType>('files');

  if (!room) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Room not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={20} color={Colors.light.tint} />
        </TouchableOpacity>
        <ThemedText type="title" style={styles.title}>Resources</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabRow}>
        {(['files', 'notes', 'whiteboard'] as TabType[]).map((tabName) => (
          <TabButton
            key={tabName}
            label={tabName.charAt(0).toUpperCase() + tabName.slice(1)}
            active={tab === tabName}
            onPress={() => setTab(tabName)}
          />
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.content} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {tab === 'files' && <FilesTab room={room} />}
        {tab === 'notes' && <NotesTab room={room} />}
        {tab === 'whiteboard' && <WhiteboardTab room={room} />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafb' },
  headerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  backButton: { padding: 8 },
  backText: { fontSize: 14, color: '#0a7ea4', fontWeight: '600' },
  title: { fontSize: 20, fontWeight: '700', flex: 1, textAlign: 'center' },
  tabRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 12, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  tab: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, backgroundColor: '#f0f0f0' },
  tabActive: { backgroundColor: '#f0f7ff', borderWidth: 1.5, borderColor: '#0a7ea4' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#666' },
  tabTextActive: { color: '#0a7ea4' },
  content: { flex: 1, paddingHorizontal: 12, paddingTop: 12 },
  tabContent: { paddingBottom: 20 },
  emptyStateContainer: { paddingVertical: 60, justifyContent: 'center', alignItems: 'center' },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyIconText: { fontSize: 56 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 8 },
  emptyDescription: { fontSize: 14, color: '#999', textAlign: 'center', marginBottom: 24, maxWidth: 260 },
  actionButton: { paddingVertical: 12, paddingHorizontal: 24, backgroundColor: '#0a7ea4', borderRadius: 8, elevation: 2, shadowColor: '#0a7ea4', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3 },
  actionButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  noteRow: { marginBottom: 12 },
  noteCardContent: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 14, backgroundColor: '#fff', borderRadius: 10, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 0.5 }, shadowOpacity: 0.05, shadowRadius: 2, gap: 12 },
  noteIcon: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#f0f7ff', justifyContent: 'center', alignItems: 'center', fontSize: 20 },
  noteTitle: { fontSize: 14, fontWeight: '700' },
  notePreview: { fontSize: 12, color: '#999', marginTop: 2, lineHeight: 16 },
  noteArrow: { fontSize: 16, color: '#0a7ea4' },
  noteArrowWrap: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#f0f7ff', justifyContent: 'center', alignItems: 'center' },
  fab: { position: 'absolute', right: 18, bottom: 28, width: 52, height: 52, borderRadius: 26, backgroundColor: '#0a7ea4', justifyContent: 'center', alignItems: 'center', elevation: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fff' },
  createButton: { marginTop: 20, backgroundColor: '#0a7ea4', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  createButtonText: { color: '#fff', fontWeight: '700' },
  whiteboardRow: { marginBottom: 12 },
  whiteboardCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 14, backgroundColor: '#fff', borderRadius: 10, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 0.5 }, shadowOpacity: 0.05, shadowRadius: 2, gap: 12 },
  whiteboardPreview: { width: 50, height: 50, borderRadius: 8, backgroundColor: '#f5e6d3', justifyContent: 'center', alignItems: 'center' },
  whiteboardPreviewIcon: { fontSize: 24 },
  whiteboardInfo: { flex: 1 },
  whiteboardTitle: { fontSize: 14, fontWeight: '700' },
  whiteboardMeta: { fontSize: 12, color: '#999', marginTop: 2 },
  whiteboardArrow: { fontSize: 16, color: '#0a7ea4' },
});
