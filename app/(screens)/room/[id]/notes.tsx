import { ThemedText } from '@/components/themed-text';
import RichTextEditor from '@/components/ui/rich-text-editor';
import { rooms } from '@/data';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Notes() {
  const { id, noteId } = useLocalSearchParams();
  const router = useRouter();
  const room = rooms.find((r) => r.id === id);

  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');

  React.useEffect(() => {
    if (!room) return;
    if (noteId) {
      const n = (room.notes || []).find((x) => x.id === noteId);
      if (n) {
        setTitle(n.title);
        setContent(n.content);
      }
    } else if (room.notes && room.notes.length > 0) {
      const first = room.notes[0];
      setTitle(first.title);
      setContent(first.content);
    }
  }, [room, noteId]);

  const save = () => {
    if (!room) return;
    if (noteId) {
      room.notes = (room.notes || []).map((n) => (n.id === noteId ? { ...n, title, content } : n));
    } else {
      const newNote = { id: `n${Date.now()}`, title: title || 'Untitled', content: content || '' };
      room.notes = [newNote, ...(room.notes || [])];
    }
    router.back();
  };

  if (!room) {
    return (
      <SafeAreaView style={{ flex: 1, padding: 16 }}>
        <ThemedText>Room not found</ThemedText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <ThemedText type="title" style={{ fontSize: 18, marginBottom: 8 }}>{noteId ? 'Edit Note' : 'Note Editor'}</ThemedText>
      <TextInput value={title} onChangeText={setTitle} placeholder="Title" style={styles.titleInput} />
      <View style={{ flex: 1 }}>
        <RichTextEditor value={content} onChange={setContent} placeholder="Start writing your note..." />
      </View>

      <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
        <TouchableOpacity style={styles.actionButton} onPress={() => router.back()}>
          <ThemedText style={{ color: '#fff' }}>Cancel</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={save}>
          <ThemedText style={{ color: '#fff' }}>Save</ThemedText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleInput: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12 },
  actionButton: { flex: 1, backgroundColor: '#999', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  saveButton: { flex: 1, backgroundColor: '#0a7ea4', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
});
