import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { currentUser, rooms } from '@/data';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Animated, Easing, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CallScreen() {
  const { id, mode } = useLocalSearchParams<{ id?: string; mode?: 'audio' | 'video' }>();
  const router = useRouter();
  const room = id ? rooms.find(r => r.id === id) : undefined;

  const [muted, setMuted] = React.useState(false);
  const [cameraOn, setCameraOn] = React.useState(true);
  const [speakerOn, setSpeakerOn] = React.useState(true);
  const [startedAt] = React.useState(() => Date.now());
  const [elapsed, setElapsed] = React.useState(0);

  const slide = React.useRef(new Animated.Value(30)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;
  const controlsSlide = React.useRef(new Animated.Value(50)).current;
  const controlsOpacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(slide, { toValue: 0, duration: 450, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 450, useNativeDriver: true }),
    ]).start();

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(controlsSlide, { toValue: 0, duration: 450, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(controlsOpacity, { toValue: 1, duration: 450, useNativeDriver: true }),
      ]).start();
    }, 150);

    const t = setInterval(() => setElapsed(Math.max(0, Math.floor((Date.now() - startedAt) / 1000))), 1000);
    return () => clearInterval(t);
  }, []);

  const hangup = () => router.back();
  const participants = room?.members || [currentUser.name];
  const remoteParticipants = participants.filter(m => m !== currentUser.name);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { transform: [{ translateY: slide }], opacity }]}>
        {/* Header with Call Info */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <ThemedText type="title" style={styles.roomName}>{room?.name ?? 'Call'}</ThemedText>
            <View style={styles.callInfo}>
              <View style={styles.modeIndicator}>
                <IconSymbol name={mode === 'video' ? 'video' : 'phone'} size={14} color="#8fd0ff" />
                <ThemedText style={styles.modeText}>{mode === 'video' ? 'Video Call' : 'Audio Call'}</ThemedText>
              </View>
              <View style={styles.divider} />
              <ThemedText style={styles.duration}>{formatElapsed(elapsed)}</ThemedText>
            </View>
          </View>
          <View style={styles.qualityIndicator}>
            <View style={styles.signalDot} />
            <ThemedText style={styles.qualityText}>Excellent</ThemedText>
          </View>
        </View>

        {/* Main Call Area */}
        <View style={styles.main}>
          {mode === 'video' ? (
            <View style={styles.videoArea}>
              <View style={styles.remoteVideo}>
                {remoteParticipants.length > 0 ? (
                  <>
                    <View style={styles.remoteAvatarContainer}>
                      {remoteParticipants.map((name, i) => {
                        const firstName = name.split(' ')[0] ?? '';
                        const initial = firstName[0]?.toUpperCase() ?? '';
                        return (
                          <View key={i} style={styles.remoteAvatar}>
                            <View style={styles.avatarCircle}>
                              <ThemedText style={styles.avatarInitial}>{initial}</ThemedText>
                            </View>
                            <ThemedText style={styles.remoteName}>{firstName}</ThemedText>
                          </View>
                        );
                      })}
                    </View>
                  </>
                ) : (
                  <ThemedText style={styles.remoteLabel}>Waiting for participant...</ThemedText>
                )}
              </View>
              <View style={styles.localPreview}>
                <View style={styles.localAvatarSmall}>
                  <ThemedText style={styles.localAvatarText}>{currentUser.name.split(' ')[0][0]}</ThemedText>
                </View>
                <ThemedText style={styles.localLabelSmall}>{currentUser.name.split(' ')[0]}</ThemedText>
              </View>
            </View>
          ) : (
            <View style={styles.audioArea}>
              <View style={styles.avatarCircle}>
                <ThemedText style={styles.avatarText}>
                  {(remoteParticipants[0] || 'Call').split(' ')[0][0]}
                </ThemedText>
              </View>
              <ThemedText type="title" style={styles.audioName}>
                {remoteParticipants[0] || room?.name || 'Audio Call'}
              </ThemedText>
              <ThemedText style={styles.audioStatus}>Connected</ThemedText>
            </View>
          )}
        </View>

        {/* Participants List */}
        {participants.length > 1 && (
          <View style={styles.participantsSection}>
            <ThemedText style={styles.participantsLabel}>
              {participants.length} Participants
            </ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.participantsList}>
              {participants.map((name, i) => (
                <ParticipantBadge key={i} name={name} isYou={name === currentUser.name} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Call Statistics */}
        <View style={styles.statsBar}>
          <StatItem icon="wifi" label={`Signal ${getSignalBars(elapsed)}`} />
          <View style={styles.statsDivider} />
          <StatItem icon="clock.fill" label={formatElapsed(elapsed)} />
          <View style={styles.statsDivider} />
          <StatItem icon="person.fill" label={`${participants.length} in call`} />
        </View>

        {/* Controls */}
        <Animated.View 
          style={[
            styles.controls,
            { 
              transform: [{ translateY: controlsSlide }],
              opacity: controlsOpacity,
            }
          ]}
        >
          <ControlButton
            icon={muted ? 'mic.slash.fill' : 'mic.fill'}
            label={muted ? 'Unmute' : 'Mute'}
            onPress={() => setMuted(v => !v)}
            active={muted}
          />

          {mode === 'video' && (
            <ControlButton
              icon={cameraOn ? 'video.fill' : 'video.slash.fill'}
              label={cameraOn ? 'Camera' : 'Camera Off'}
              onPress={() => setCameraOn(v => !v)}
              active={!cameraOn}
            />
          )}

          <ControlButton
            icon={speakerOn ? 'speaker.wave.2.fill' : 'speaker.fill'}
            label={speakerOn ? 'Speaker' : 'Speaker Off'}
            onPress={() => setSpeakerOn(v => !v)}
            active={!speakerOn}
          />

          <TouchableOpacity style={styles.hangup} onPress={hangup} activeOpacity={0.8}>
            <IconSymbol name="phone.down.fill" size={24} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
}

function ControlButton({ icon, label, onPress, active }: { icon: string; label: string; onPress: () => void; active?: boolean }) {
  return (
    <TouchableOpacity style={[styles.controlButton, active && styles.controlButtonActive]} onPress={onPress} activeOpacity={0.7}>
      <IconSymbol name={icon} size={20} color={active ? '#fff' : '#8fd0ff'} />
      <ThemedText style={[styles.controlLabel, active && { color: '#fff' }]}>{label}</ThemedText>
    </TouchableOpacity>
  );
}

function ParticipantBadge({ name, isYou }: { name: string; isYou: boolean }) {
  return (
    <View style={[styles.participantBadge, isYou && styles.participantBadgeYou]}>
      <View style={styles.participantAvatar}>
        <ThemedText style={styles.participantAvatarText}>{name.split(' ')[0][0]}</ThemedText>
      </View>
      <ThemedText style={styles.participantName}>{name.split(' ')[0]}</ThemedText>
      {isYou && <ThemedText style={styles.youBadge}>You</ThemedText>}
    </View>
  );
}

function StatItem({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={styles.statItem}>
      <IconSymbol name={icon} size={16} color="#8fd0ff" />
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
    </View>
  );
}

function formatElapsed(s: number) {
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

function getSignalBars(elapsed: number) {
  if (elapsed < 5) return '◆◆◇';
  if (elapsed < 30) return '◆◆◆';
  return '◆◆◆';
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1220' },
  content: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, paddingTop: 8 },
  headerContent: { flex: 1 },
  roomName: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 8 },
  callInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  modeIndicator: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(143, 208, 255, 0.15)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  modeText: { fontSize: 12, color: '#8fd0ff', fontWeight: '600' },
  divider: { width: 1, height: 14, backgroundColor: '#4a6a8a' },
  duration: { fontSize: 13, color: '#cbd5e1', fontWeight: '700' },
  qualityIndicator: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(76, 175, 80, 0.15)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  signalDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4caf50' },
  qualityText: { fontSize: 11, color: '#4caf50', fontWeight: '600' },
  main: { flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  videoArea: { width: '100%', height: '100%', position: 'relative', justifyContent: 'center', alignItems: 'center' },
  remoteVideo: { flex: 1, width: '100%', borderRadius: 16, backgroundColor: '#071023', justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 },
  remoteAvatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  remoteAvatar: {
    alignItems: 'center',
    marginRight: 16,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a7ea4',
    overflow: 'hidden',
  },
  avatarInitial: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
  },
  remoteName: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '700',
    color: '#8fd0ff',
  },
  remoteLabel: { color: '#9fbcd8', fontSize: 14 },
  localPreview: { position: 'absolute', right: 16, top: 16, width: 110, height: 150, borderRadius: 12, backgroundColor: '#0f1724', justifyContent: 'center', alignItems: 'center', elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4, shadowRadius: 4, borderWidth: 2, borderColor: '#0a7ea4' },
  localAvatarSmall: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#0a7ea4', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  localAvatarText: { fontSize: 24, fontWeight: '800', color: '#fff' },
  localLabelSmall: { color: '#8fd0ff', fontWeight: '700', fontSize: 12 },
  audioArea: { justifyContent: 'center', alignItems: 'center', paddingVertical: 40 },
  avatarCircle: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#0a7ea4', justifyContent: 'center', alignItems: 'center', marginBottom: 24, elevation: 5, shadowColor: '#0a7ea4', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8 },
  avatarText: { color: '#fff', fontSize: 48, fontWeight: '800' },
  audioName: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 8 },
  audioStatus: { fontSize: 13, color: '#8fd0ff', fontWeight: '600' },
  participantsSection: { marginBottom: 12 },
  participantsLabel: { fontSize: 12, color: '#cbd5e1', fontWeight: '600', marginBottom: 8, marginLeft: 4 },
  participantsList: { maxHeight: 90 },
  participantBadge: { marginRight: 12, alignItems: 'center', backgroundColor: 'rgba(143, 208, 255, 0.1)', borderRadius: 12, padding: 10, borderWidth: 1.5, borderColor: '#4a6a8a' },
  participantBadgeYou: { borderColor: '#0a7ea4', backgroundColor: 'rgba(10, 126, 164, 0.15)' },
  participantAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#0a7ea4', justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  participantAvatarText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  participantName: { fontSize: 11, color: '#8fd0ff', fontWeight: '600', marginBottom: 4 },
  youBadge: { fontSize: 10, color: '#4caf50', fontWeight: '700', backgroundColor: 'rgba(76, 175, 80, 0.2)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  statsBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: 'rgba(143, 208, 255, 0.08)', borderRadius: 12, paddingVertical: 12, marginBottom: 16, borderWidth: 1, borderColor: '#4a6a8a' },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statLabel: { fontSize: 11, color: '#cbd5e1', fontWeight: '600' },
  statsDivider: { width: 1, height: 20, backgroundColor: '#4a6a8a' },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 12, gap: 8 },
  controlButton: { alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 12, backgroundColor: '#fff', width: 88, height: 48, flexDirection: 'row', gap: 6 },
  controlButtonActive: { backgroundColor: '#0a7ea4' },
  controlLabel: { fontSize: 11, color: '#0a7ea4', fontWeight: '600' },
  hangup: { backgroundColor: '#e74c3c', width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', elevation: 3, shadowColor: '#e74c3c', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 },
});
