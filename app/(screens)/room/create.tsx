import { ThemedText } from '@/components/themed-text';
import { Room, currentUser, rooms } from '@/data';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Animated, Easing, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateRoom() {
  const router = useRouter();
  const [name, setName] = React.useState('');
  const [memberInput, setMemberInput] = React.useState('');
  const [members, setMembers] = React.useState<string[]>([]);
  const [focusedField, setFocusedField] = React.useState<string | null>(null);
  const [creating, setCreating] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
  
  const slideAnim = React.useRef(new Animated.Value(30)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;
  const formScaleAnim = React.useRef(members.map(() => new Animated.Value(0))).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [slideAnim, opacityAnim]);

  React.useEffect(() => {
    formScaleAnim.slice(0, members.length).forEach((scale, index) => {
      setTimeout(() => {
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          speed: 12,
          bounciness: 8,
        }).start();
      }, 50 * index);
    });
  }, [members.length, formScaleAnim]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!name.trim()) {
      errors.name = 'Room name is required';
    } else if (name.trim().length < 3) {
      errors.name = 'Room name must be at least 3 characters';
    } else if (name.trim().length > 50) {
      errors.name = 'Room name must be less than 50 characters';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const addMember = () => {
    const trimmed = memberInput.trim();
    if (!trimmed) {
      Alert.alert('Empty Name', 'Please enter a member name');
      return;
    }
    if (trimmed.length < 2) {
      Alert.alert('Invalid Name', 'Member name must be at least 2 characters');
      return;
    }
    if (members.includes(trimmed)) {
      Alert.alert('Duplicate', 'This member is already added');
      return;
    }
    setMembers([...members, trimmed]);
    setMemberInput('');
  };

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const create = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors in the form');
      return;
    }
    try {
      setCreating(true);
      const id = `r${Date.now()}`;
      const newRoom: Room = {
        id,
        name: name.trim(),
        members: members.length ? members : [currentUser.name],
        messages: [],
        notes: [],
        whiteboards: [],
      };
      await new Promise(resolve => setTimeout(resolve, 1000));
      rooms.push(newRoom);
      router.replace(`/(screens)/room/${id}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to create room. Please try again.');
      setCreating(false);
    }
  };

  const canAddMembers = memberInput.trim().length >= 2;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.content,
            {
              transform: [{ translateY: slideAnim }],
              opacity: opacityAnim,
            },
          ]}
        >

          {/* Header */}
          <View style={styles.headerSection}>
            <ThemedText type="title" style={styles.heading}>
              Create Study Room
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Build a collaborative space for learning
            </ThemedText>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <FormField
              label="Room Name"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
              }}
              placeholder="e.g. Calculus Study Group"
              isFocused={focusedField === 'name'}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              required
              helperText="Give your room a descriptive name (3-50 characters)"
              maxLength={50}
              charCount={name.length}
              error={formErrors.name}
            />

            <View style={styles.membersSectionContainer}>
              <View style={styles.memberInputRow}>
                <View style={styles.memberInputField}>
                  <View style={styles.labelRow}>
                    <ThemedText style={styles.label}>Add Members</ThemedText>
                    <ThemedText style={styles.optionalText}>(Optional)</ThemedText>
                  </View>
                  <TextInput
                    value={memberInput}
                    onChangeText={setMemberInput}
                    placeholder="Enter member name"
                    placeholderTextColor="#aaa"
                    onFocus={() => setFocusedField('members')}
                    onBlur={() => setFocusedField(null)}
                    style={[
                      styles.input,
                      focusedField === 'members' && styles.inputFocused,
                    ]}
                    onSubmitEditing={addMember}
                  />
                </View>
                <TouchableOpacity
                  style={[
                    styles.addButton,
                    !canAddMembers && styles.addButtonDisabled,
                  ]}
                  onPress={addMember}
                  disabled={!canAddMembers || creating}
                  activeOpacity={0.7}
                >
                  <ThemedText style={styles.addButtonText}>+</ThemedText>
                </TouchableOpacity>
              </View>
            </View>

            {members.length > 0 && (
              <View style={styles.tagsContainer}>
                <ThemedText style={styles.tagsLabel}>
                  Members Added ({members.length})
                </ThemedText>
                <View style={styles.tagsGrid}>
                  {members.map((member, index) => (
                    <Animated.View
                      key={`${member}-${index}`}
                      style={{
                        transform: [
                          { scale: formScaleAnim[index] || new Animated.Value(0) },
                        ],
                      }}
                    >
                      <MemberTag
                        name={member}
                        onRemove={() => removeMember(index)}
                      />
                    </Animated.View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonsSection}>
            <TouchableOpacity
              style={[
                styles.createButton,
                (!name.trim() || creating) && styles.createButtonDisabled,
              ]}
              onPress={create}
              disabled={!name.trim() || creating}
              activeOpacity={0.7}
            >
              <ThemedText style={styles.createButtonText}>
                {creating ? 'Creating Room...' : 'Create Room'}
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.back()}
              disabled={creating}
              activeOpacity={0.7}
            >
              <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  isFocused,
  onFocus,
  onBlur,
  required,
  helperText,
  maxLength,
  charCount,
  error,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  isFocused?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  required?: boolean;
  helperText?: string;
  maxLength?: number;
  charCount?: number;
  error?: string;
}) {
  return (
    <View style={styles.fieldContainer}>
      <View style={styles.labelRow}>
        <ThemedText style={styles.label}>
          {label}
          {required && <ThemedText style={styles.required}>*</ThemedText>}
        </ThemedText>
        {charCount !== undefined && maxLength && (
          <ThemedText style={styles.charCount}>{charCount}/{maxLength}</ThemedText>
        )}
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        onFocus={onFocus}
        onBlur={onBlur}
        maxLength={maxLength}
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          error && styles.inputError,
        ]}
      />
      {error ? (
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      ) : helperText ? (
        <ThemedText style={styles.helperText}>{helperText}</ThemedText>
      ) : null}
    </View>
  );
}

function MemberTag({ name, onRemove }: { name: string; onRemove: () => void }) {
  return (
    <View style={styles.memberTag}>
      <ThemedText style={styles.memberTagText}>{name}</ThemedText>
      <TouchableOpacity onPress={onRemove} activeOpacity={0.6}>
        <ThemedText style={styles.memberTagRemove}>✕</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

function TipItem({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <View style={styles.tipItem}>
      <ThemedText style={styles.tipIcon}>{icon}</ThemedText>
      <View style={styles.tipContent}>
        <ThemedText style={styles.tipTitle}>{title}</ThemedText>
        <ThemedText style={styles.tipDescription}>{description}</ThemedText>
      </View>
    </View>
  );
}

function TemplateButton({ name, description, onPress }: { name: string; description: string; onPress: () => void }) {
  return (
    <TouchableOpacity 
      style={styles.templateButton}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.templateContent}>
        <ThemedText style={styles.templateName}>{name}</ThemedText>
        <ThemedText style={styles.templateDescription}>{description}</ThemedText>
      </View>
      <ThemedText style={styles.templateArrow}>→</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafb' },
  content: { paddingHorizontal: 20, paddingVertical: 16 },
  progressSection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, paddingVertical: 12 },
  progressStep: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#ddd' },
  progressStepActive: { backgroundColor: '#0a7ea4', borderColor: '#0a7ea4' },
  progressStepText: { color: '#999', fontWeight: '700', fontSize: 14 },
  progressStepTextActive: { color: '#fff' },
  progressLine: { flex: 1, height: 2, backgroundColor: '#e0e0e0', marginHorizontal: 8 },
  headerSection: { marginBottom: 28 },
  heading: { fontSize: 28, fontWeight: '800', marginBottom: 8, color: '#1a1a1a' },
  subtitle: { fontSize: 14, color: '#999', fontWeight: '500' },
  formSection: { marginBottom: 28 },
  fieldContainer: { marginBottom: 20 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#333' },
  optionalText: { fontSize: 12, color: '#999', fontWeight: '400', fontStyle: 'italic' },
  required: { color: '#e74c3c', marginLeft: 4 },
  charCount: { fontSize: 12, color: '#999', fontWeight: '500' },
  input: { borderWidth: 1.5, borderColor: '#d0d0d0', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, backgroundColor: '#fff', color: '#333' },
  inputFocused: { borderColor: '#0a7ea4', backgroundColor: '#f0f7ff', elevation: 2, shadowColor: '#0a7ea4', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3 },
  inputError: { borderColor: '#e74c3c', backgroundColor: '#fff5f5' },
  helperText: { fontSize: 12, color: '#999', marginTop: 4, fontWeight: '400' },
  errorText: { fontSize: 12, color: '#e74c3c', marginTop: 4, fontWeight: '600' },
  membersSectionContainer: { marginBottom: 20 },
  memberInputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
  memberInputField: { flex: 1 },
  addButton: { width: 48, height: 48, borderRadius: 10, backgroundColor: '#0a7ea4', justifyContent: 'center', alignItems: 'center', elevation: 2, shadowColor: '#0a7ea4', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.15, shadowRadius: 3 },
  addButtonDisabled: { backgroundColor: '#ddd', opacity: 0.5 },
  addButtonText: { color: '#fff', fontWeight: '700', fontSize: 20 },
  tagsContainer: { marginBottom: 20 },
  tagsLabel: { fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 10 },
  tagsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  memberTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f7ff', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#0a7ea4', gap: 8 },
  memberTagText: { fontSize: 12, fontWeight: '600', color: '#0a7ea4' },
  memberTagRemove: { fontSize: 14, color: '#0a7ea4', fontWeight: '700' },
  infoBox: { backgroundColor: '#f0f7ff', borderLeftWidth: 3, borderLeftColor: '#0a7ea4', borderRadius: 10, padding: 12, marginTop: 20 },
  infoTitle: { fontSize: 13, fontWeight: '700', color: '#0a7ea4', marginBottom: 6 },
  infoText: { fontSize: 12, color: '#666', lineHeight: 18 },
  buttonsSection: { gap: 12, marginBottom: 28 },
  createButton: { paddingVertical: 14, paddingHorizontal: 24, backgroundColor: '#0a7ea4', borderRadius: 10, alignItems: 'center', justifyContent: 'center', elevation: 3, shadowColor: '#0a7ea4', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 },
  createButtonDisabled: { backgroundColor: '#ddd', opacity: 0.6 },
  createButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  cancelButton: { paddingVertical: 12, paddingHorizontal: 24, backgroundColor: '#f5f5f5', borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e0e0e0' },
  cancelButtonText: { color: '#666', fontWeight: '600', fontSize: 14 },
  tipsSection: { marginBottom: 28 },
  tipsTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a1a', marginBottom: 12 },
  tipItem: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 10, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 0.5 }, shadowOpacity: 0.05, shadowRadius: 2 },
  tipIcon: { fontSize: 20, marginRight: 12, marginTop: 2 },
  tipContent: { flex: 1 },
  tipTitle: { fontSize: 13, fontWeight: '700', color: '#1a1a1a', marginBottom: 2 },
  tipDescription: { fontSize: 12, color: '#999', fontWeight: '400' },
  templatesSection: { marginBottom: 20 },
  templatesTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a1a', marginBottom: 12 },
  templateButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 10, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 0.5 }, shadowOpacity: 0.05, shadowRadius: 2, borderLeftWidth: 3, borderLeftColor: '#0a7ea4' },
  templateContent: { flex: 1 },
  templateName: { fontSize: 13, fontWeight: '700', color: '#1a1a1a', marginBottom: 2 },
  templateDescription: { fontSize: 11, color: '#999', fontWeight: '400' },
  templateArrow: { fontSize: 16, color: '#0a7ea4', fontWeight: '700' },
});
