import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { rooms } from '@/data';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { PanResponder, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

export default function WhiteboardEditor() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const room = rooms.find((r) => r.id === id);

  const [strokes, setStrokes] = React.useState<any[]>(() => []);
  const [current, setCurrent] = React.useState<{ x: number; y: number }[]>([]);
  const [color, setColor] = React.useState<string>('#000');
  const [strokeWidth, setStrokeWidth] = React.useState<number>(3);

  React.useEffect(() => {
    if (!room) return;
    // Attempt to hydrate from first whiteboard entry if it has data
    const wb = room.whiteboards && room.whiteboards[0];
    if (wb && (wb as any).data) {
      setStrokes((wb as any).data || []);
    }
  }, [id]);

  const pan = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e, g) => {
        const x = e.nativeEvent.locationX;
        const y = e.nativeEvent.locationY;
        setCurrent([{ x, y }]);
      },
      onPanResponderMove: (e, g) => {
        const x = e.nativeEvent.locationX;
        const y = e.nativeEvent.locationY;
        setCurrent((c) => [...c, { x, y }]);
      },
      onPanResponderRelease: () => {
        if (current.length > 0) {
          setStrokes((s) => [...s, { color, strokeWidth, points: current }]);
          setCurrent([]);
        }
      },
    })
  ).current;

  const undo = () => setStrokes((s) => s.slice(0, -1));
  const clear = () => setStrokes([]);

  const save = () => {
    if (!room) return;
    // Save strokes into a whiteboard entry (first one for now)
    if (!room.whiteboards) room.whiteboards = [];
    if (room.whiteboards.length === 0) {
      room.whiteboards.push({ id: `w${Date.now()}`, title: 'Canvas', data: strokes });
    } else {
      (room.whiteboards[0] as any).data = strokes;
    }
    router.back();
  };

  const buildPath = (points: { x: number; y: number }[]) => {
    if (!points || points.length === 0) return '';
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ');
  };

  if (!room) {
    return (
      <SafeAreaView style={styles.container}>
        <ThemedText>Whiteboard not found</ThemedText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <IconSymbol name="chevron.left" size={20} color={Colors.light.tint} />
        </TouchableOpacity>
        <ThemedText type="title" style={styles.title}>Whiteboard</ThemedText>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.tool} onPress={undo}>
          <IconSymbol name="chevron.left" size={20} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tool} onPress={clear}>
          <IconSymbol name="trash" size={20} color="#e33" />
        </TouchableOpacity>
        <View style={{ width: 12 }} />
        {['#000', '#0a7ea4', '#e34', '#f5a623'].map((c) => (
          <TouchableOpacity key={c} style={[styles.colorSwatch, { backgroundColor: c, borderWidth: color === c ? 2 : 0 }]} onPress={() => setColor(c)} />
        ))}
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={[styles.saveBtn]} onPress={save}>
          <ThemedText style={{ color: '#fff', fontWeight: '700' }}>Save</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.canvasWrap} {...pan.panHandlers}>
        <Svg style={styles.svg} width="100%" height="100%">
          {strokes.map((s, i) => (
            <Path key={i} d={buildPath(s.points)} stroke={s.color} strokeWidth={s.strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          ))}
          {current.length > 0 && (
            <Path d={buildPath(current)} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          )}
        </Svg>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  iconBtn: { padding: 8 },
  title: { fontSize: 18, fontWeight: '700' },
  toolbar: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#fafafa' },
  tool: { padding: 8, marginRight: 6, borderRadius: 8, backgroundColor: '#fff', elevation: 1 },
  colorSwatch: { width: 28, height: 28, borderRadius: 6, marginHorizontal: 4 },
  saveBtn: { backgroundColor: '#0a7ea4', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  canvasWrap: { flex: 1, backgroundColor: '#fff' },
  svg: { flex: 1 },
});
