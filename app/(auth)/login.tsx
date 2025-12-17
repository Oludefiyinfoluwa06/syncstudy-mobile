import { Link, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, View } from 'react-native';

import AuthForm from '@/components/auth-form';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function LoginScreen() {
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
    // TODO: hook up auth
    router.replace('/(tabs)');
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
              Welcome Back
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Sign in to continue learning
            </ThemedText>
          </View>

          <AuthForm
            title="Sign In"
            fields={[
              { key: 'email', placeholder: 'Email', keyboardType: 'email-address' },
              { key: 'password', placeholder: 'Password', secure: true },
            ]}
            submitLabel="Sign In"
            onSubmit={handleSubmit}
            footer={
              <View style={styles.footer}>
                <View style={styles.links}>
                  <Link href="/forgot-password">
                    <Link.Trigger>
                      <ThemedText style={styles.link}>Forgot password?</ThemedText>
                    </Link.Trigger>
                  </Link>
                </View>
                <View style={styles.signUpSection}>
                  <ThemedText style={styles.signUpText}>
                    Don&rsquo;t have an account?
                  </ThemedText>
                  <Link href="/register">
                    <Link.Trigger>
                      <ThemedText style={styles.signUpLink}>Create one</ThemedText>
                    </Link.Trigger>
                  </Link>
                </View>
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
  links: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  link: {
    color: '#0a7ea4',
    fontSize: 14,
    fontWeight: '600',
  },
  signUpSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  signUpText: {
    fontSize: 14,
    color: '#666',
  },
  signUpLink: {
    fontSize: 14,
    color: '#0a7ea4',
    fontWeight: '700',
  },
});
