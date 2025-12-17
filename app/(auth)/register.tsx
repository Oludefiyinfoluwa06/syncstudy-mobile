import { Link, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, View } from 'react-native';

import AuthForm from '@/components/auth-form';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function RegisterScreen() {
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
    // TODO: hook up registration
    router.replace('/(auth)/login');
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
              Create Account
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Join us and start studying smarter
            </ThemedText>
          </View>

          <AuthForm
            title="Sign Up"
            fields={[
              { key: 'name', placeholder: 'Full name' },
              { key: 'email', placeholder: 'Email', keyboardType: 'email-address' },
              { key: 'password', placeholder: 'Password', secure: true },
              { key: 'confirm', placeholder: 'Confirm password', secure: true },
            ]}
            submitLabel="Create Account"
            onSubmit={handleSubmit}
            footer={
              <View style={styles.footer}>
                <View style={styles.signinSection}>
                  <ThemedText style={styles.signinText}>
                    Already have an account?
                  </ThemedText>
                  <Link href="/login">
                    <Link.Trigger>
                      <ThemedText style={styles.signinLink}>Sign in</ThemedText>
                    </Link.Trigger>
                  </Link>
                </View>
                <ThemedText style={styles.disclaimer}>
                  By creating an account, you agree to our Terms of Service
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
  },
  footer: {
    marginTop: 24,
    gap: 16,
  },
  signinSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  signinText: {
    fontSize: 14,
    color: '#666',
  },
  signinLink: {
    fontSize: 14,
    color: '#0a7ea4',
    fontWeight: '700',
  },
  disclaimer: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
