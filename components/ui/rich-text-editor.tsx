import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Props = {
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  style?: any;
  inputStyle?: any;
};

export default function RichTextEditor({ value = '', onChange = () => {}, placeholder, style, inputStyle }: Props) {
  const [text, setText] = React.useState<string>(value);
  const [selection, setSelection] = React.useState<{ start: number; end: number }>({ start: 0, end: 0 });

  React.useEffect(() => {
    setText(value ?? '');
  }, [value]);

  const applyWrap = (wrapBefore: string, wrapAfter?: string) => {
    const after = wrapAfter ?? wrapBefore;
    const { start, end } = selection;
    const before = text.slice(0, start ?? 0);
    const selected = text.slice(start ?? 0, end ?? 0);
    const rest = text.slice(end ?? 0);

    let newText: string;
    let newPos = end + wrapBefore.length + (wrapAfter ? 0 : 0);

    if (start !== end) {
      // wrap selected text
      newText = `${before}${wrapBefore}${selected}${after}${rest}`;
      newPos = end + wrapBefore.length + after.length;
    } else {
      // insert template and place cursor between
      const placeholder = '';
      newText = `${before}${wrapBefore}${placeholder}${after}${rest}`;
      newPos = start + wrapBefore.length;
    }

    setText(newText);
    // set selection after state updates
    requestAnimationFrame(() => {
      setSelection({ start: newPos, end: newPos });
    });
    onChange(newText);
  };

  const handleChange = (v: string) => {
    setText(v);
    onChange(v);
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={() => applyWrap('**')} style={styles.toolButton}>
          <Text style={styles.toolText}>B</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => applyWrap('*')} style={styles.toolButton}>
          <Text style={styles.toolText}>I</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => applyWrap('__')} style={styles.toolButton}>
          <Text style={styles.toolText}>U</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => applyWrap('- ')} style={styles.toolButton}>
          <Text style={styles.toolText}>•</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => applyWrap('# ')} style={styles.toolButton}>
          <Text style={styles.toolText}>H1</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        multiline
        value={text}
        onChangeText={handleChange}
        placeholder={placeholder}
        style={[styles.input, inputStyle]}
        selection={selection}
        onSelectionChange={(e) => setSelection(e.nativeEvent.selection)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  toolbar: { flexDirection: 'row', gap: 8, paddingVertical: 8, paddingHorizontal: 4 },
  toolButton: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, backgroundColor: '#f0f0f0' },
  toolText: { fontWeight: '700' },
  input: { minHeight: 120, borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, padding: 10, backgroundColor: '#fff', textAlignVertical: 'top' },
});
