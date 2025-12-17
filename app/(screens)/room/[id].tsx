import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { rooms } from '@/data';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Animated, Easing, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RoomDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const room = rooms.find((r) => r.id === id);
  const [reply, setReply] = React.useState('');
  const scrollViewRef = React.useRef<ScrollView>(null);

  if (!room) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Room not found</ThemedText>
      </ThemedView>
    );
  }

  const send = () => {
    // TODO: send message via API/socket
    setReply('');
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={20} color={Colors.light.tint} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.nameBlock} 
          onPress={() => router.push({
            pathname: "/(screens)/room/[id]/resources",
            params: { id: String(room.id) },
          })}
        >
          <ThemedText type="defaultSemiBold" style={styles.roomName}>{room.name}</ThemedText>
          <ThemedText style={styles.roomMemberCount}>{room.members.length} members</ThemedText>
        </TouchableOpacity>

        <View style={styles.iconRow}>
          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.7}
            onPress={() => router.push({ pathname: '/(screens)/room/[id]/call', params: { id: String(room.id), mode: 'video' } })}
            accessibilityLabel="Start video call"
          >
            <IconSymbol name="video" size={20} color={Colors.light.tint} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.7}
            onPress={() => router.push({ pathname: '/(screens)/room/[id]/call', params: { id: String(room.id), mode: 'audio' } })}
            accessibilityLabel="Start audio call"
          >
            <IconSymbol name="speaker" size={20} color={Colors.light.tint} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Chat Messages */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.chat}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {room.messages && room.messages.length > 0 ? (
          room.messages.map((m, index) => (
            <ChatMessage key={m.id} message={m} index={index} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyStateText}>No messages yet</ThemedText>
            <ThemedText style={styles.emptyStateSubtext}>Start the conversation!</ThemedText>
          </View>
        )}
      </ScrollView>

      {/* Input Area */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputRow}>
          <TextInput 
            placeholder="Type a message..." 
            value={reply} 
            onChangeText={setReply} 
            style={styles.input}
            placeholderTextColor="#aaa"
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            onPress={send} 
            style={[styles.sendButton, !reply.trim() && styles.sendButtonDisabled]}
            disabled={!reply.trim()}
            activeOpacity={0.7}
          >
            <IconSymbol name="paperplane.fill" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
        <ThemedText style={styles.charCount}>{reply.length}/500</ThemedText>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function ChatMessage({ message, index }: { message: any; index: number }) {
  const slideAnim = new Animated.Value(30);
  const opacityAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        delay: index * 30,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        delay: index * 30,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.messageRow,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <View style={styles.messageHeader}>
        <ThemedText type="defaultSemiBold" style={styles.senderName}>{message.from}</ThemedText>
        <ThemedText style={styles.messageTime}>
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </ThemedText>
      </View>
      <ThemedText style={styles.messageContent}>{message.text}</ThemedText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8fafb',
  },
  headerRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1, 
    borderBottomColor: '#f0f0f0',
  },
  backButton: { 
    paddingRight: 8,
    paddingLeft: 4,
    paddingVertical: 4,
  },
  backText: {
    fontSize: 14,
    color: '#0a7ea4',
    fontWeight: '600',
  },
  nameBlock: { 
    flex: 1, 
    marginHorizontal: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  roomName: {
    fontSize: 16,
    fontWeight: '700',
  },
  roomMemberCount: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  iconRow: { 
    flexDirection: 'row', 
    gap: 8,
  },
  iconButton: { 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    backgroundColor: '#f0f7ff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chat: { 
    flex: 1, 
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 8,
  },
  messageRow: { 
    marginBottom: 12, 
    paddingVertical: 10, 
    paddingHorizontal: 12, 
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  senderName: {
    fontSize: 13,
    color: '#0a7ea4',
  },
  messageTime: {
    fontSize: 11,
    color: '#999',
  },
  messageContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  inputContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  inputRow: { 
    flexDirection: 'row', 
    alignItems: 'flex-end', 
    gap: 8,
  },
  input: { 
    flex: 1, 
    borderWidth: 1.5,
    borderColor: '#d0d0d0',
    borderRadius: 10, 
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 40,
    maxHeight: 80,
    backgroundColor: '#f9fafb',
    fontSize: 14,
    color: '#333',
  },
  sendButton: { 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    backgroundColor: '#0a7ea4',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 40,
    elevation: 2,
    shadowColor: '#0a7ea4',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  sendButtonDisabled: {
    backgroundColor: '#ddd',
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  charCount: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    textAlign: 'right',
  },
});
