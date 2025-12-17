import { ThemedText } from '@/components/themed-text';
import { currentUser } from '@/data';
import React from 'react';
import { Alert, Animated, Easing, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const [name, setName] = React.useState(currentUser.name);
  const [bio, setBio] = React.useState(currentUser.bio || '');
  const [hasChanges, setHasChanges] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [focusedField, setFocusedField] = React.useState<string | null>(null);

  const slideAnim = React.useRef(new Animated.Value(20)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

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
  }, []);

  if (!currentUser) {
    return (
      <SafeAreaView style={styles.container}>
        <ThemedText style={{ padding: 20 }}>No user data available</ThemedText>
      </SafeAreaView>
    );
  }

  const handleNameChange = (text: string) => {
    setName(text);
    setHasChanges(true);
  };

  const handleBioChange = (text: string) => {
    setBio(text);
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter your full name');
      return;
    }

    try {
      setSaving(true);
      // TODO: save changes to backend
      console.log('Profile saved:', { name, email: currentUser.email, bio });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setHasChanges(false);
      Alert.alert('Success', 'Your profile has been updated successfully!');
    } catch {
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

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
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <ThemedText style={styles.avatarText}>
                  {name.split(' ')[0][0]}{name.split(' ')[1]?.[0] || ''}
                </ThemedText>
              </View>
            </View>
            <ThemedText type="title" style={styles.title}>
              {currentUser.name}
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              {currentUser.email}
            </ThemedText>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Full Name */}
            <FormField
              label="Full Name"
              value={name}
              onChangeText={handleNameChange}
              placeholder="Enter your full name"
              isFocused={focusedField === 'name'}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              required
            />

            {/* Email */}
            <FormField
              label="Email"
              value={currentUser.email}
              placeholder="Email"
              keyboardType="email-address"
              editable={false}
              disabled
              helperText="Email cannot be changed"
              isFocused={focusedField === 'email'}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
            />

            {/* Bio */}
            <FormField
              label="Bio"
              value={bio}
              onChangeText={handleBioChange}
              placeholder="Tell us about yourself"
              multiline
              numberOfLines={4}
              isFocused={focusedField === 'bio'}
              onFocus={() => setFocusedField('bio')}
              onBlur={() => setFocusedField(null)}
              helperText={`${bio.length}/200`}
              maxLength={200}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonsSection}>
            <TouchableOpacity
              style={[
                styles.saveButton,
                (!hasChanges || saving) && styles.saveButtonDisabled
              ]}
              onPress={handleSave}
              disabled={!hasChanges || saving}
              activeOpacity={0.7}
            >
              <ThemedText style={styles.saveButtonText}>
                {saving ? 'Saving...' : 'Save Changes'}
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setName(currentUser.name);
                setBio(currentUser.bio || '');
                setHasChanges(false);
              }}
              disabled={!hasChanges}
              activeOpacity={0.7}
            >
              <ThemedText style={styles.cancelButtonText}>
                Discard Changes
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Footer Info */}
          <View style={styles.footerSection}>
            <TouchableOpacity style={styles.logoutButton}>
              <ThemedText style={styles.logoutButtonText}>Log Out</ThemedText>
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
  keyboardType,
  editable,
  disabled,
  helperText,
  isFocused,
  onFocus,
  onBlur,
  multiline,
  numberOfLines,
  maxLength,
  required,
}: {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  editable?: boolean;
  disabled?: boolean;
  helperText?: string;
  isFocused?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  required?: boolean;
}) {
  return (
    <View style={styles.fieldContainer}>
      <View style={styles.labelRow}>
        <ThemedText style={styles.label}>
          {label}
          {required && <ThemedText style={styles.required}>*</ThemedText>}
        </ThemedText>
        {helperText && (
          <ThemedText style={styles.helperText}>{helperText}</ThemedText>
        )}
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        keyboardType={keyboardType}
        editable={editable !== false && !disabled}
        onFocus={onFocus}
        onBlur={onBlur}
        multiline={multiline}
        numberOfLines={numberOfLines}
        maxLength={maxLength}
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          disabled && styles.inputDisabled,
          multiline && styles.bioInput,
        ]}
      />
      {disabled && (
        <ThemedText style={styles.disabledHint}>This field cannot be edited</ThemedText>
      )}
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
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 8,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#0a7ea4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0a7ea4',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  formSection: {
    marginBottom: 28,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  required: {
    color: '#e74c3c',
    marginLeft: 4,
  },
  helperText: {
    fontSize: 12,
    color: '#999',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#d0d0d0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: '#fff',
    color: '#333',
  },
  inputFocused: {
    borderColor: '#0a7ea4',
    backgroundColor: '#f0f7ff',
    elevation: 2,
    shadowColor: '#0a7ea4',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  inputDisabled: {
    backgroundColor: '#f5f5f5',
    color: '#999',
  },
  bioInput: {
    textAlignVertical: 'top',
    minHeight: 100,
    paddingTop: 12,
  },
  disabledHint: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    fontStyle: 'italic',
  },
  buttonsSection: {
    marginBottom: 28,
    gap: 12,
  },
  saveButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
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
  saveButtonDisabled: {
    backgroundColor: '#ddd',
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 14,
  },
  footerSection: {
    marginBottom: 20,
  },
  footerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  settingsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  settingsArrow: {
    fontSize: 16,
    color: '#0a7ea4',
  },
  logoutButton: {
    marginTop: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#e74c3c',
  },
  logoutButtonText: {
    color: '#e74c3c',
    fontWeight: '700',
    fontSize: 16,
  },
});
