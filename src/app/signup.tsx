import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/auth-context';
import { authStyles } from './login';

export default function SignupScreen() {
  const router = useRouter(); const insets = useSafeAreaInsets(); const { signup } = useAuth();
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [mobile, setMobile] = useState(''); const [password, setPassword] = useState(''); const [confirmation, setConfirmation] = useState(''); const [error, setError] = useState('');
  const update = (setter: (value: string) => void) => (value: string) => { setter(value); setError(''); };
  const submit = () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (name.trim().length < 2) return setError('Enter your full name.');
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) return setError('Enter a valid email address.');
    if (!/^\+?[0-9]{10,15}$/.test(mobile.trim().replace(/[\s()-]/g, ''))) return setError('Enter a valid mobile number.');
    if (password.length < 6) return setError('Password must contain at least 6 characters.');
    if (password !== confirmation) return setError('Passwords do not match.');
    signup(name.trim(), normalizedEmail); router.replace('/home');
  };
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={authStyles.screen}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={[authStyles.content, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 }]}>
        <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => router.back()} style={authStyles.backButton}><Text style={authStyles.backText}>{'\u2039'}</Text></Pressable>
        <View style={authStyles.icon}><Text style={authStyles.iconText}>{'\u{1F464}'}</Text></View>
        <Text style={authStyles.eyebrow}>CREATE ACCOUNT</Text><Text style={authStyles.title}>Let’s get you signed up</Text><Text style={authStyles.subtitle}>Create an account to save your details and track every order.</Text>
        <Text style={authStyles.label}>Full name</Text><TextInput autoCapitalize="words" autoComplete="name" onChangeText={update(setName)} placeholder="Your name" placeholderTextColor="#9A989D" style={authStyles.input} value={name} />
        <Text style={authStyles.label}>Email address</Text><TextInput autoCapitalize="none" autoComplete="email" keyboardType="email-address" onChangeText={update(setEmail)} placeholder="you@example.com" placeholderTextColor="#9A989D" style={authStyles.input} value={email} />
        <Text style={authStyles.label}>Mobile number</Text><TextInput autoComplete="tel" keyboardType="phone-pad" onChangeText={update(setMobile)} placeholder="Enter your mobile number" placeholderTextColor="#9A989D" style={authStyles.input} value={mobile} />
        <Text style={authStyles.label}>Password</Text><TextInput autoCapitalize="none" autoComplete="new-password" onChangeText={update(setPassword)} placeholder="At least 6 characters" placeholderTextColor="#9A989D" secureTextEntry style={authStyles.input} value={password} />
        <Text style={authStyles.label}>Confirm password</Text><TextInput autoCapitalize="none" autoComplete="new-password" onChangeText={update(setConfirmation)} onSubmitEditing={submit} placeholder="Re-enter your password" placeholderTextColor="#9A989D" returnKeyType="done" secureTextEntry style={authStyles.input} value={confirmation} />
        {error ? <Text style={authStyles.error}>{error}</Text> : null}<Pressable onPress={submit} style={({ pressed }) => [authStyles.primaryButton, pressed && authStyles.pressed]}><Text style={authStyles.primaryButtonText}>Create account</Text></Pressable>
        <View style={authStyles.signupRow}><Text style={authStyles.signupPrompt}>Already registered? </Text><Pressable accessibilityRole="link" onPress={() => router.replace('/login')}><Text style={authStyles.signupLink}>Login</Text></Pressable></View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
