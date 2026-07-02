import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useCart } from '@/context/cart-context';

const ORANGE = '#F76532';

export default function OrderConfirmationScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { clearCart } = useCart();
  const params = useLocalSearchParams<{
    items?: string;
    orderId?: string;
    payment?: 'online' | 'cod';
    total?: string;
  }>();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  const shortOrderId = params.orderId?.slice(-6) ?? '------';
  const paymentLabel = params.payment === 'cod' ? 'Cash on delivery' : 'Online payment';

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 20 }]}>
      <View style={styles.successIcon}><Text style={styles.check}>✓</Text></View>
      <Text style={styles.eyebrow}>ORDER CONFIRMED</Text>
      <Text style={styles.title}>Your food is on its way!</Text>
      <Text style={styles.copy}>The restaurant has received your order and will start preparing it shortly.</Text>

      <View style={styles.orderCard}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Order number</Text>
          <Text style={styles.detailValue}>#{shortOrderId}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Items</Text>
          <Text style={styles.detailValue}>{params.items ?? '0'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Payment</Text>
          <Text style={styles.detailValue}>{paymentLabel}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total</Text>
          <Text style={styles.total}>₹{params.total ?? '0'}</Text>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => router.replace('/home')}
        style={({ pressed }) => [styles.homeButton, pressed && styles.pressed]}>
        <Text style={styles.homeButtonText}>Back to home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FBFAF8', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  successIcon: { width: 82, height: 82, borderRadius: 41, backgroundColor: '#E8F7EA', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  check: { color: '#25843A', fontSize: 42, fontWeight: '900' },
  eyebrow: { color: ORANGE, fontSize: 10, fontWeight: '900', letterSpacing: 1.3 },
  title: { color: '#1C1C1F', fontSize: 28, lineHeight: 34, fontWeight: '900', textAlign: 'center', marginTop: 9 },
  copy: { color: '#77767B', fontSize: 13, lineHeight: 20, textAlign: 'center', marginTop: 9, maxWidth: 330 },
  orderCard: { width: '100%', maxWidth: 390, borderRadius: 20, backgroundColor: '#FFFFFF', borderWidth: StyleSheet.hairlineWidth, borderColor: '#DEDAD4', padding: 18, marginTop: 28, gap: 13 },
  detailRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
  detailLabel: { color: '#858287', fontSize: 12 },
  detailValue: { color: '#29282C', fontSize: 12, fontWeight: '800', textAlign: 'right' },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: '#E5E1DB' },
  total: { color: ORANGE, fontSize: 18, fontWeight: '900' },
  homeButton: { width: '100%', maxWidth: 390, height: 58, borderRadius: 18, backgroundColor: ORANGE, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  homeButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '900' },
  pressed: { opacity: 0.74 },
});
