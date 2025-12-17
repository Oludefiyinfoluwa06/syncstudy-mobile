import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { currentUser, rooms } from '@/data';
import { useRouter } from 'expo-router';
import React from 'react';
import { Animated, Easing, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  
  const slideAnim = new Animated.Value(30);
  const opacityAnim = new Animated.Value(0);
  const buttonsScale = React.useRef(rooms.map(() => new Animated.Value(0))).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Stagger room card animations
    buttonsScale.forEach((scale, index) => {
      setTimeout(() => {
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          speed: 12,
          bounciness: 8,
        }).start();
      }, 100 * index);
    });
  }, []);

  const goToMyRooms = () => router.push('/(tabs)/my-rooms');
  const goToProfile = () => router.push('/(tabs)/profile');

  const openRoom = (id: string) => router.push({ pathname: '/(screens)/room/[id]/resources', params: { id } });

  const createRoom = () => {
    const id = `r${Date.now()}`;
    const newRoom = { id, name: 'New Room', members: [currentUser.name], messages: [], notes: [], whiteboards: [] };
    rooms.unshift(newRoom as any);
    router.push({ pathname: '/(screens)/room/create', params: { id } });
  };

  const hasRooms = rooms && rooms.length > 0;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Animated.ScrollView 
        showsVerticalScrollIndicator={false}
        style={{
          opacity: opacityAnim,
        }}
      >
        <Animated.View
          style={[
            styles.content,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.headerSection}>
            <ThemedText type="title" style={styles.greeting}>
              Hello, {currentUser.name.split(' ')[0]} 👋
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Welcome back to your study hub
            </ThemedText>
          </View>

          {/* Quick Action Cards */}
          <View style={styles.actionsSection}>
            <ActionCard 
              icon="plus"
              title="Create Room"
              description="Start a new study group"
              onPress={createRoom}
              color="#0a7ea4"
            />
            <ActionCard 
              icon="folder"
              title="My Rooms"
              description="View all your groups"
              onPress={goToMyRooms}
              color="#27ae60"
            />
            <ActionCard 
              icon="user"
              title="Profile"
              description="Manage your account"
              onPress={goToProfile}
              color="#e67e22"
            />
          </View>

          {/* Recent Rooms Section */}
          {hasRooms && (
            <View style={styles.recentSection}>
              <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                Recent Rooms
              </ThemedText>
              <ThemedText style={styles.sectionSubtitle}>
                {rooms.length} {rooms.length === 1 ? 'room' : 'rooms'} total
              </ThemedText>

              <FlatList
                data={rooms}
                keyExtractor={(r) => r.id}
                horizontal
                scrollEnabled={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.roomsListContent}
                renderItem={({ item, index }) => (
                  <Animated.View
                    style={{
                      transform: [{ scale: buttonsScale[index] || new Animated.Value(0) }],
                    }}
                  >
                    <RoomCard 
                      room={item}
                      onPress={() => openRoom(item.id)}
                    />
                  </Animated.View>
                )}
              />
            </View>
          )}

          {/* Empty State */}
          {!hasRooms && (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <ThemedText style={styles.emptyIconText}>📚</ThemedText>
              </View>
              <ThemedText style={styles.emptyTitle}>
                No rooms yet
              </ThemedText>
              <ThemedText style={styles.emptyDescription}>
                Create your first study room to get started
              </ThemedText>
              <TouchableOpacity 
                style={styles.emptyButton}
                onPress={createRoom}
                activeOpacity={0.7}
              >
                <ThemedText style={styles.emptyButtonText}>Create Room</ThemedText>
              </TouchableOpacity>
            </View>
          )}

          {/* Stats Section */}
          <View style={styles.statsSection}>
            <StatCard 
              label="Total Rooms"
              value={rooms.length.toString()}
              icon="folder"
            />
            <StatCard 
              label="Study Groups"
              value={(rooms.reduce((sum, r) => sum + (r.members?.length || 0), 0)).toString()}
              icon="user"
            />
            <StatCard 
              label="Messages"
              value={(rooms.reduce((sum, r) => sum + (r.messages?.length || 0), 0)).toString()}
              icon="chat"
            />
          </View>
        </Animated.View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

function ActionCard({
  icon,
  title,
  description,
  onPress,
  color,
}: {
  icon: string;
  title: string;
  description: string;
  onPress: () => void;
  color: string;
}) {
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
      speed: 15,
      bounciness: 10,
    }).start();
  };

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
      }}
    >
      <TouchableOpacity
        style={[styles.actionCard, { borderLeftColor: color }]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.7}
      >
        <View style={[styles.actionIconContainer, { backgroundColor: color + '15' }]}>
          <IconSymbol name={icon} size={24} color={color} />
        </View>
        <View style={styles.actionContent}>
          <ThemedText style={styles.actionTitle}>{title}</ThemedText>
          <ThemedText style={styles.actionDescription}>{description}</ThemedText>
        </View>
        <IconSymbol name="chevron-right" size={20} color="#999" />
      </TouchableOpacity>
    </Animated.View>
  );
}

function RoomCard({
  room,
  onPress,
}: {
  room: any;
  onPress: () => void;
}) {
  const messageCount = room.messages?.length || 0;
  const noteCount = room.notes?.length || 0;

  return (
    <TouchableOpacity
      style={styles.roomCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.roomHeader}>
        <ThemedText style={styles.roomName} numberOfLines={1}>
          {room.name}
        </ThemedText>
        <View style={styles.membersCount}>
          <ThemedText style={styles.membersCountText}>
            {room.members?.length || 1}
          </ThemedText>
        </View>
      </View>

      <View style={styles.roomMeta}>
        <View style={styles.metaItem}>
          <IconSymbol name="chat" size={14} color="#0a7ea4" />
          <ThemedText style={styles.metaText}>{messageCount}</ThemedText>
        </View>
        <View style={styles.metaItem}>
          <IconSymbol name="document" size={14} color="#27ae60" />
          <ThemedText style={styles.metaText}>{noteCount}</ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIconContainer}>
        <IconSymbol name={icon} size={20} color="#0a7ea4" />
      </View>
      <ThemedText style={styles.statValue}>{value}</ThemedText>
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafb',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerSection: {
    marginBottom: 28,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  actionsSection: {
    marginBottom: 28,
    gap: 12,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 3,
  },
  actionDescription: {
    fontSize: 12,
    color: '#999',
    fontWeight: '400',
  },
  recentSection: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
    fontWeight: '500',
  },
  roomsListContent: {
    paddingVertical: 8,
    paddingRight: 20,
  },
  roomCard: {
    width: 140,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  roomName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 8,
  },
  membersCount: {
    backgroundColor: '#f0f7ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  membersCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0a7ea4',
  },
  roomMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
  },
  statsSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyIconText: {
    fontSize: 64,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#999',
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyButton: {
    paddingHorizontal: 28,
    paddingVertical: 12,
    backgroundColor: '#0a7ea4',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#0a7ea4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  emptyButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});
