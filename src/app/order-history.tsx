import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ORANGE = '#F76532';

export default function OrderHistoryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20 }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}><Text style={styles.backIcon}>‹</Text></Pressable>
        <View><Text style={styles.eyebrow}>ACCOUNT</Text><Text style={styles.title}>Order history</Text></View>
      </View>
      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>◷</Text>
        <Text style={styles.emptyTitle}>No past orders yet</Text>
        <Text style={styles.emptyCopy}>Your completed orders will appear here.</Text>
        <Pressable onPress={() => router.replace('/home')} style={styles.browseButton}><Text style={styles.browseText}>Browse restaurants</Text></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FBFAF8', paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  backButton: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#FFFFFF', borderWidth: StyleSheet.hairlineWidth, borderColor: '#DEDAD4', alignItems: 'center', justifyContent: 'center' },
  backIcon: { color: '#222226', fontSize: 35, lineHeight: 37, marginTop: -4 },
  eyebrow: { color: ORANGE, fontSize: 9, fontWeight: '900', letterSpacing: 1.1 },
  title: { color: '#1B1B1E', fontSize: 24, fontWeight: '900', marginTop: 2 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 70 },
  emptyIcon: { color: ORANGE, fontSize: 52 },
  emptyTitle: { color: '#222226', fontSize: 21, fontWeight: '900', marginTop: 16 },
  emptyCopy: { color: '#77767B', fontSize: 13, marginTop: 7 },
  browseButton: { marginTop: 22, borderRadius: 15, backgroundColor: ORANGE, paddingHorizontal: 22, paddingVertical: 14 },
  browseText: { color: '#FFFFFF', fontSize: 13, fontWeight: '900' },
});
