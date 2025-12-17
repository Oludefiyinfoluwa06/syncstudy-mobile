import { Link, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, View } from 'react-native';

import AuthForm from '@/components/auth-form';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ForgotPasswordScreen() {
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
    // TODO: send reset email
    router.push('/reset-password');
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
              Reset Password
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Enter your email and we&rsquo;ll send you a link to reset your password
            </ThemedText>
          </View>

          <AuthForm
            title="Forgot Password"
            fields={[{ key: 'email', placeholder: 'Email', keyboardType: 'email-address' }]}
            submitLabel="Send Reset Link"
            onSubmit={handleSubmit}
            footer={
              <View style={styles.footer}>
                <View style={styles.backSection}>
                  <Link href="/login">
                    <Link.Trigger>
                      <ThemedText style={styles.backLink}>← Back to sign in</ThemedText>
                    </Link.Trigger>
                  </Link>
                </View>
                <ThemedText style={styles.info}>
                  Check your email for a link to reset your password
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
  backSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  backLink: {
    color: '#0a7ea4',
    fontSize: 14,
    fontWeight: '600',
  },
  info: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
