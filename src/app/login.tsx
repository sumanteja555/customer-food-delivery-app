import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/auth-context';

const ORANGE = '#F76532';

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ redirect?: string }>();
  const insets = useSafeAreaInsets();
  const { login, logout, user } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    const normalizedIdentifier = identifier.trim().toLowerCase();
    const isEmail = /^\S+@\S+\.\S+$/.test(normalizedIdentifier);
    const isMobile = /^\+?[0-9]{10,15}$/.test(normalizedIdentifier.replace(/[\s()-]/g, ''));
    if (!isEmail && !isMobile) return setError('Enter a valid email address or mobile number.');
    if (password.length < 6) return setError('Password must contain at least 6 characters.');
    login(normalizedIdentifier);
    router.replace(params.redirect === '/cart' ? '/cart' : '/home');
  };

  if (user) {
    return (
      <ScrollView
        style={authStyles.screen}
        contentContainerStyle={[
          authStyles.accountContent,
          { paddingTop: insets.top + 28, paddingBottom: insets.bottom + 110 },
        ]}>
        <Text style={authStyles.accountEyebrow}>YOUR ACCOUNT</Text>
        <View style={authStyles.profileCard}>
          <View style={authStyles.profileAvatar}><Text style={authStyles.profileAvatarText}>{'\u{1F464}'}</Text></View>
          <Text style={authStyles.profileName}>{user.name}</Text>
          <Text style={authStyles.profileEmail}>{user.email}</Text>
        </View>

        <View style={authStyles.accountMenu}>
          <Pressable
            onPress={() => router.push('/saved-addresses')}
            style={({ pressed }) => [authStyles.accountMenuItem, pressed && authStyles.pressed]}>
            <Text style={authStyles.accountMenuIcon}>⌖</Text>
            <View style={authStyles.accountMenuCopy}>
              <Text style={authStyles.accountMenuTitle}>Saved addresses</Text>
              <Text style={authStyles.accountMenuSubtitle}>Manage your delivery locations</Text>
            </View>
            <Text style={authStyles.accountMenuChevron}>›</Text>
          </Pressable>
          <View style={authStyles.accountDivider} />
          <Pressable
            onPress={() => router.push('/order-history')}
            style={({ pressed }) => [authStyles.accountMenuItem, pressed && authStyles.pressed]}>
            <Text style={authStyles.accountMenuIcon}>◷</Text>
            <View style={authStyles.accountMenuCopy}>
              <Text style={authStyles.accountMenuTitle}>Order history</Text>
              <Text style={authStyles.accountMenuSubtitle}>See your previous orders</Text>
            </View>
            <Text style={authStyles.accountMenuChevron}>›</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={() => {
            logout();
            router.replace('/home');
          }}
          style={({ pressed }) => [authStyles.logoutButton, pressed && authStyles.pressed]}>
          <Text style={authStyles.logoutButtonText}>Logout</Text>
        </Pressable>
      </ScrollView>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={authStyles.screen}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={[authStyles.content, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 110 }]}>
        <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => router.back()} style={authStyles.backButton}><Text style={authStyles.backText}>{'\u2039'}</Text></Pressable>
        <View style={authStyles.icon}><Text style={authStyles.iconText}>{'\u{1F464}'}</Text></View>
        <Text style={authStyles.eyebrow}>WELCOME BACK</Text>
        <Text style={authStyles.title}>Login to your account</Text>
        <Text style={authStyles.subtitle}>Sign in to see your orders and make checkout faster.</Text>
        <Text style={authStyles.label}>Email address / Mobile number</Text>
        <TextInput autoCapitalize="none" autoComplete="username" keyboardType="default" onChangeText={(value) => { setIdentifier(value); setError(''); }} placeholder="Email address or mobile number" placeholderTextColor="#9A989D" style={authStyles.input} value={identifier} />
        <Text style={authStyles.label}>Password</Text>
        <TextInput autoCapitalize="none" autoComplete="current-password" onChangeText={(value) => { setPassword(value); setError(''); }} onSubmitEditing={submit} placeholder="Enter your password" placeholderTextColor="#9A989D" returnKeyType="done" secureTextEntry style={authStyles.input} value={password} />
        {error ? <Text style={authStyles.error}>{error}</Text> : null}
        <Pressable onPress={submit} style={({ pressed }) => [authStyles.primaryButton, pressed && authStyles.pressed]}><Text style={authStyles.primaryButtonText}>Login</Text></Pressable>
        <View style={authStyles.signupRow}>
          <Text style={authStyles.signupPrompt}>Not a registered user? </Text>
          <Pressable accessibilityRole="link" onPress={() => router.push('/signup')}><Text style={authStyles.signupLink}>Sign up</Text></Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export const authStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FBFAF8' }, content: { flexGrow: 1, paddingHorizontal: 24 },
  backButton: { width: 44, height: 44, borderRadius: 15, backgroundColor: '#FFFFFF', borderWidth: StyleSheet.hairlineWidth, borderColor: '#E1DED8', alignItems: 'center', justifyContent: 'center', marginBottom: 30 },
  backText: { color: '#252428', fontSize: 34, lineHeight: 36, marginTop: -3 }, icon: { width: 66, height: 66, borderRadius: 22, backgroundColor: '#FFF0E9', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 24 }, iconText: { fontSize: 29 },
  eyebrow: { color: ORANGE, fontSize: 10, fontWeight: '800', letterSpacing: 1.4, marginBottom: 8, textAlign: 'center' }, title: { color: '#19191B', fontSize: 31, lineHeight: 38, fontWeight: '800', letterSpacing: -0.7 }, subtitle: { color: '#76757A', fontSize: 14, lineHeight: 21, marginTop: 9, marginBottom: 30, maxWidth: 340 },
  label: { color: '#343337', fontSize: 12, fontWeight: '700', marginBottom: 8 }, input: { height: 56, borderRadius: 17, backgroundColor: '#FFFFFF', borderWidth: StyleSheet.hairlineWidth, borderColor: '#DDD9D3', paddingHorizontal: 16, color: '#1E1E21', fontSize: 15, marginBottom: 18 },
  error: { color: '#B42318', fontSize: 12, lineHeight: 18, marginTop: -7, marginBottom: 12 }, primaryButton: { minHeight: 57, borderRadius: 18, backgroundColor: ORANGE, alignItems: 'center', justifyContent: 'center', marginTop: 6 }, primaryButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  signupRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 25 }, signupPrompt: { color: '#77767B', fontSize: 14 }, signupLink: { color: ORANGE, fontSize: 14, fontWeight: '800' }, pressed: { opacity: 0.75 },
  accountContent: { flexGrow: 1, paddingHorizontal: 22 },
  accountEyebrow: { color: ORANGE, fontSize: 11, fontWeight: '900', letterSpacing: 1.5, textAlign: 'center', marginBottom: 18 },
  profileCard: { alignItems: 'center', borderRadius: 28, paddingVertical: 28, paddingHorizontal: 20, backgroundColor: '#FFFFFF', borderWidth: StyleSheet.hairlineWidth, borderColor: '#E6E1DA' },
  profileAvatar: { width: 76, height: 76, borderRadius: 27, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF0E9', marginBottom: 16 },
  profileAvatarText: { fontSize: 32 },
  profileName: { color: '#1D1C1F', fontSize: 22, fontWeight: '900', textTransform: 'capitalize' },
  profileEmail: { color: '#77747A', fontSize: 13, marginTop: 6 },
  accountMenu: { marginTop: 18, borderRadius: 24, paddingHorizontal: 14, backgroundColor: '#FFFFFF', borderWidth: StyleSheet.hairlineWidth, borderColor: '#E6E1DA' },
  accountMenuItem: { minHeight: 74, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6 },
  accountMenuIcon: { width: 38, color: ORANGE, fontSize: 21, fontWeight: '800' },
  accountMenuCopy: { flex: 1 },
  accountMenuTitle: { color: '#2B292D', fontSize: 14, fontWeight: '800' },
  accountMenuSubtitle: { color: '#89868C', fontSize: 11, marginTop: 4 },
  accountMenuChevron: { color: '#AAA6A0', fontSize: 26 },
  accountDivider: { height: StyleSheet.hairlineWidth, backgroundColor: '#E8E3DD', marginLeft: 44 },
  logoutButton: { height: 54, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF0ED', marginTop: 18 },
  logoutButtonText: { color: '#B42318', fontSize: 14, fontWeight: '900' },
});
