import { ThemedText } from '@/components/themed-text';
import { Room, rooms } from '@/data';
import { useRouter } from 'expo-router';
import React from 'react';
import { Animated, Easing, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MyRoomsScreen() {
  const router = useRouter();
  
  const renderRoom = ({ item, index }: { item: Room; index: number }) => (
    <RoomCard room={item} index={index} onPress={() => router.push(`/(screens)/room/${item.id}`)} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <ThemedText type="title" style={styles.title}>My Rooms</ThemedText>
        <ThemedText style={styles.subtitle}>{rooms.length} study rooms</ThemedText>
      </View>

      <View style={styles.createRow}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push('/(screens)/room/create')}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.createButtonText}>+ Create Room</ThemedText>
        </TouchableOpacity>
      </View>
      <FlatList 
        data={rooms} 
        renderItem={renderRoom} 
        keyExtractor={(r) => r.id}
        contentContainerStyle={styles.listContent}
        scrollEventThrottle={16}
      />
    </SafeAreaView>
  );
}

function RoomCard({ room, index, onPress }: { room: Room; index: number; onPress: () => void }) {
  const scaleAnim = new Animated.Value(0.95);
  const opacityAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        delay: index * 50,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        delay: index * 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.roomCardWrapper,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <TouchableOpacity 
        onPress={onPress} 
        style={styles.roomCard}
        activeOpacity={0.75}
      >
        <View style={styles.roomCardHeader}>
          <View style={styles.roomBadge}>
            <ThemedText style={styles.roomBadgeText}>{room.members.length}</ThemedText>
          </View>
          <View style={{ flex: 1 }}>
            <ThemedText type="defaultSemiBold" style={styles.roomName}>
              {room.name}
            </ThemedText>
            <ThemedText style={styles.roomSubtitle}>Room ID: {room.id}</ThemedText>
          </View>
        </View>

        <View style={styles.membersContainer}>
          <ThemedText style={styles.memberLabel}>Members:</ThemedText>
          <ThemedText style={styles.membersList} numberOfLines={1}>
            {room.members.join(', ')}
          </ThemedText>
        </View>

        <View style={styles.messagePreviewContainer}>
          <ThemedText style={styles.messageLabel}>Latest:</ThemedText>
          <ThemedText 
            style={styles.messagePreview} 
            numberOfLines={1}
          >
            {room.lastMessage?.text || 'No messages yet'}
          </ThemedText>
        </View>

        <View style={styles.cardFooter}>
          <ThemedText style={styles.timestamp}>
            {room.lastMessage ? new Date(room.lastMessage.createdAt).toLocaleDateString() : 'Not started'}
          </ThemedText>
          <View style={styles.arrowIcon}>
            <ThemedText style={{ fontSize: 16, color: '#0a7ea4' }}>→</ThemedText>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8fafb' 
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  roomCardWrapper: {
    marginBottom: 12,
  },
  roomCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  roomCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  roomBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roomBadgeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0a7ea4',
  },
  roomName: {
    fontSize: 16,
    fontWeight: '700',
  },
  roomSubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  membersContainer: {
    marginBottom: 10,
  },
  memberLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
    marginBottom: 4,
  },
  membersList: {
    fontSize: 13,
    color: '#555',
  },
  messagePreviewContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#0a7ea4',
  },
  messageLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
    marginBottom: 4,
  },
  messagePreview: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  arrowIcon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  createButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  createButtonText: { color: '#fff', fontWeight: '700' },
});
