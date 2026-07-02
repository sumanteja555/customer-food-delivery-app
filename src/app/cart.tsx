import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CartQuantityControl from '@/components/cart-quantity-control';
import { useAddresses } from '@/context/address-context';
import { useAuth } from '@/context/auth-context';
import { useCart } from '@/context/cart-context';
import { findRestaurant } from '@/data/restaurants';

const ORANGE = '#F76532';
type PaymentMethod = 'online' | 'cod';

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { lines, totalItems, totalPrice } = useCart();
  const { addresses, selectedAddress, deliveryLocation } = useAddresses();
  const { user } = useAuth();
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const cartRestaurant = lines[0] ? findRestaurant(lines[0].restaurantId) : null;
  const restaurantLandmark = cartRestaurant?.address.split(',')[0] ?? cartRestaurant?.city ?? 'Restaurant location';
  const selectedLocation = !user
    ? restaurantLandmark
    : selectedAddress
      ? selectedAddress.formattedAddress
      : deliveryLocation?.formattedAddress ?? 'Select a delivery address';

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
        <View style={styles.locationHeader}>
          <Text style={styles.locationHeaderLabel}>
            {!user
              ? 'RESTAURANT LANDMARK'
              : `DELIVERING TO${selectedAddress ? ` · ${selectedAddress.label.toUpperCase()}` : ''}`}
          </Text>
          <Text style={styles.locationHeaderText} numberOfLines={2}>{selectedLocation}</Text>
        </View>
      </View>

      {lines.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyCopy}>Add something delicious from a restaurant menu.</Text>
          <Pressable onPress={() => router.replace('/home')} style={styles.browseButton}>
            <Text style={styles.browseText}>Browse restaurants</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 150 }}>
            {lines.map((line) => {
              const restaurant = findRestaurant(line.restaurantId);
              return (
                <View key={line.item.id} style={styles.lineCard}>
                  <Image source={{ uri: line.item.image }} style={styles.lineImage} contentFit="cover" />
                  <View style={styles.lineCopy}>
                    <Text style={styles.lineName} numberOfLines={2}>{line.item.name}</Text>
                    <Text style={styles.restaurantName} numberOfLines={1}>{restaurant?.name}</Text>
                    <Text style={styles.linePrice}>₹{line.item.price * line.quantity}</Text>
                  </View>
                  <CartQuantityControl restaurantId={line.restaurantId} item={line.item} />
                </View>
              );
            })}
            {showPaymentOptions && (
              <View style={styles.paymentSection}>
                <Text style={styles.paymentEyebrow}>PAYMENT</Text>
                <Text style={styles.paymentTitle}>Choose payment method</Text>
                <View style={styles.paymentOptions}>
                  <Pressable
                    accessibilityRole="radio"
                    accessibilityState={{ checked: paymentMethod === 'online' }}
                    onPress={() => setPaymentMethod('online')}
                    style={[styles.paymentOption, paymentMethod === 'online' && styles.paymentOptionSelected]}>
                    <View style={[styles.radio, paymentMethod === 'online' && styles.radioSelected]}>
                      {paymentMethod === 'online' && <View style={styles.radioDot} />}
                    </View>
                    <View>
                      <Text style={styles.paymentOptionTitle}>Pay online</Text>
                      <Text style={styles.paymentOptionCopy}>UPI, card or net banking</Text>
                    </View>
                  </Pressable>
                  <Pressable
                    accessibilityRole="radio"
                    accessibilityState={{ checked: paymentMethod === 'cod' }}
                    onPress={() => setPaymentMethod('cod')}
                    style={[styles.paymentOption, paymentMethod === 'cod' && styles.paymentOptionSelected]}>
                    <View style={[styles.radio, paymentMethod === 'cod' && styles.radioSelected]}>
                      {paymentMethod === 'cod' && <View style={styles.radioDot} />}
                    </View>
                    <View>
                      <Text style={styles.paymentOptionTitle}>Cash on delivery</Text>
                      <Text style={styles.paymentOptionCopy}>Pay when your order arrives</Text>
                    </View>
                  </Pressable>
                </View>
              </View>
            )}
          </ScrollView>

          <View style={[styles.summary, { paddingBottom: insets.bottom + 14 }]}>
            <View>
              <Text style={styles.totalLabel}>{totalItems} {totalItems === 1 ? 'item' : 'items'}</Text>
              <Text style={styles.totalPrice}>₹{totalPrice}</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                if (!user) {
                  router.push({ pathname: '/login', params: { redirect: '/cart' } });
                  return;
                }
                if (addresses.length > 0) {
                  if (!showPaymentOptions) {
                    setShowPaymentOptions(true);
                    return;
                  }
                  if (!paymentMethod) return;
                  router.replace({
                    pathname: '/order-confirmation',
                    params: {
                      items: String(totalItems),
                      total: String(totalPrice),
                      payment: paymentMethod,
                      orderId: String(Date.now()),
                    },
                  });
                  return;
                }
                router.push({
                  pathname: '/',
                  params: {
                    add: '1',
                    returnTo: 'cart',
                    ...(addresses.length === 0 ? { details: '1' } : {}),
                  },
                });
              }}
              disabled={showPaymentOptions && addresses.length > 0 && !paymentMethod}
              style={({ pressed }) => [
                styles.checkoutButton,
                showPaymentOptions && addresses.length > 0 && !paymentMethod && styles.checkoutButtonDisabled,
                pressed && styles.pressed,
              ]}>
              <Text style={styles.checkoutText}>
                {!user
                  ? 'Login'
                  : addresses.length === 0
                    ? 'Select address'
                    : showPaymentOptions && !paymentMethod
                      ? 'Select payment method'
                      : 'Place order'}
              </Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FBFAF8' },
  header: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 20, paddingBottom: 20, gap: 10 },
  backButton: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#FFFFFF', borderWidth: StyleSheet.hairlineWidth, borderColor: '#DEDAD4', alignItems: 'center', justifyContent: 'center' },
  backIcon: { color: '#222226', fontSize: 35, lineHeight: 37, marginTop: -4 },
  locationHeader: { flex: 1, minHeight: 44, borderRadius: 14, backgroundColor: '#FFFFFF', borderWidth: StyleSheet.hairlineWidth, borderColor: '#DEDAD4', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, paddingVertical: 6 },
  locationHeaderLabel: { color: ORANGE, fontSize: 8, lineHeight: 10, fontWeight: '900', letterSpacing: 0.7 },
  locationHeaderText: { color: '#29282C', fontSize: 11, lineHeight: 14, fontWeight: '700', textAlign: 'center', marginTop: 2 },
  lineCard: { minHeight: 126, flexDirection: 'row', alignItems: 'center', gap: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#DEDAD4', paddingVertical: 16 },
  lineImage: { width: 78, height: 78, borderRadius: 16, backgroundColor: '#E8E3DC' },
  lineCopy: { flex: 1 },
  lineName: { color: '#242327', fontSize: 14, lineHeight: 18, fontWeight: '800' },
  restaurantName: { color: '#858287', fontSize: 10, marginTop: 4 },
  linePrice: { color: '#343337', fontSize: 13, fontWeight: '800', marginTop: 8 },
  summary: { position: 'absolute', left: 0, right: 0, bottom: 0, minHeight: 104, backgroundColor: '#FFFFFF', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#DEDAD4', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 14, gap: 18 },
  totalLabel: { color: '#858287', fontSize: 10, fontWeight: '700' },
  totalPrice: { color: '#1D1D20', fontSize: 19, fontWeight: '900', marginTop: 2 },
  checkoutButton: { flex: 1, height: 56, borderRadius: 17, backgroundColor: ORANGE, alignItems: 'center', justifyContent: 'center' },
  checkoutButtonDisabled: { backgroundColor: '#B8B3AE' },
  checkoutText: { color: '#FFFFFF', fontSize: 14, fontWeight: '900' },
  paymentSection: { marginTop: 12, marginBottom: 18, borderRadius: 20, backgroundColor: '#FFFFFF', borderWidth: StyleSheet.hairlineWidth, borderColor: '#DEDAD4', padding: 16 },
  paymentEyebrow: { color: ORANGE, fontSize: 9, fontWeight: '900', letterSpacing: 1.1 },
  paymentTitle: { color: '#222226', fontSize: 18, fontWeight: '900', marginTop: 5 },
  paymentOptions: { gap: 10, marginTop: 14 },
  paymentOption: { minHeight: 68, borderRadius: 15, borderWidth: 1, borderColor: '#E1DDD7', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14 },
  paymentOptionSelected: { borderColor: ORANGE, backgroundColor: '#FFF4EF' },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: '#AAA6A0', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  radioSelected: { borderColor: ORANGE },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: ORANGE },
  paymentOptionTitle: { color: '#29282C', fontSize: 13, fontWeight: '800' },
  paymentOptionCopy: { color: '#858287', fontSize: 10, marginTop: 3 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 34, paddingBottom: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 18 },
  emptyTitle: { color: '#222226', fontSize: 22, fontWeight: '900' },
  emptyCopy: { color: '#77767B', fontSize: 13, lineHeight: 20, textAlign: 'center', marginTop: 8 },
  browseButton: { marginTop: 22, borderRadius: 15, backgroundColor: ORANGE, paddingHorizontal: 22, paddingVertical: 14 },
  browseText: { color: '#FFFFFF', fontSize: 13, fontWeight: '900' },
  pressed: { opacity: 0.7 },
});
