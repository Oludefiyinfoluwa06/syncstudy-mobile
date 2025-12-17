import React from 'react';
import { ActivityIndicator, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

type Field = {
  key: string;
  placeholder: string;
  secure?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
};

export default function AuthForm({
  title,
  fields,
  submitLabel,
  onSubmit,
  footer,
}: {
  title: string;
  fields: Field[];
  submitLabel: string;
  onSubmit: (values: Record<string, string>) => Promise<void> | void;
  footer?: React.ReactNode;
}) {
  const [values, setValues] = React.useState<Record<string, string>>(
    Object.fromEntries(fields.map((f) => [f.key, '']))
  );
  const [loading, setLoading] = React.useState(false);
  const [focusedField, setFocusedField] = React.useState<string | null>(null);

  const handleChange = (key: string, text: string) =>
    setValues((s) => ({ ...s, [key]: text }));

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await onSubmit(values);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        {title}
      </ThemedText>

      <View style={styles.form}>
        {fields.map((f) => (
          <View key={f.key} style={styles.inputWrapper}>
            <TextInput
              placeholder={f.placeholder}
              placeholderTextColor="#aaa"
              secureTextEntry={!!f.secure}
              keyboardType={f.keyboardType || 'default'}
              value={values[f.key]}
              onChangeText={(t) => handleChange(f.key, t)}
              onFocus={() => setFocusedField(f.key)}
              onBlur={() => setFocusedField(null)}
              style={[
                styles.input,
                focusedField === f.key && styles.inputFocused,
              ]}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        ))}

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.7}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.submit}>
              {submitLabel}
            </ThemedText>
          )}
        </TouchableOpacity>
      </View>

      {footer}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  title: {
    marginBottom: 4,
    fontSize: 18,
    fontWeight: '600',
  },
  form: {
    gap: 12,
  },
  inputWrapper: {
    marginVertical: 4,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#d0d0d0',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  inputFocused: {
    borderColor: '#0a7ea4',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#0a7ea4',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonContainer: {
    marginTop: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#0a7ea4',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#0a7ea4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  submit: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
