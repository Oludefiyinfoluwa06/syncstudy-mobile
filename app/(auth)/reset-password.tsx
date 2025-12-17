import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, View } from 'react-native';

import AuthForm from '@/components/auth-form';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const slideAnim = new Animated.Value(30);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSubmit = async (values: Record<string, string>) => {
    // TODO: call password reset API with token
    router.replace('/login');
  };

  return (
    <ScrollView contentContainerStyle={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.header}>
            <ThemedText type="title" style={styles.heading}>
              Create New Password
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Enter a strong password to secure your account
            </ThemedText>
          </View>

          <AuthForm
            title="Set New Password"
            fields={[
              { key: 'password', placeholder: 'New password', secure: true },
              { key: 'confirm', placeholder: 'Confirm password', secure: true },
            ]}
            submitLabel="Reset Password"
            onSubmit={handleSubmit}
            footer={
              <View style={styles.footer}>
                <View style={styles.tips}>
                  <ThemedText style={styles.tipsTitle}>Password tips:</ThemedText>
                  <ThemedText style={styles.tipItem}>• At least 8 characters long</ThemedText>
                  <ThemedText style={styles.tipItem}>• Mix of uppercase, lowercase, and numbers</ThemedText>
                  <ThemedText style={styles.tipItem}>• Avoid common words or patterns</ThemedText>
                </View>
                <ThemedText style={styles.info}>
                  After resetting, you&rsquo;ll be able to sign in with your new password.
                </ThemedText>
              </View>
            }
          />
        </Animated.View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 20,
  },
  content: {
    paddingHorizontal: 20,
    gap: 24,
  },
  header: {
    gap: 8,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    marginTop: 24,
    gap: 16,
  },
  tips: {
    backgroundColor: '#f0f7ff',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  tipsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0a7ea4',
    marginBottom: 4,
  },
  tipItem: {
    fontSize: 12,
    color: '#555',
    lineHeight: 18,
  },
  info: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
