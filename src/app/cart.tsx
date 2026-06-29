import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CartQuantityControl from '@/components/cart-quantity-control';
import { useCart } from '@/context/cart-context';
import { findRestaurant } from '@/data/restaurants';

const ORANGE = '#F76532';

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { lines, totalItems, totalPrice } = useCart();

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
        <View>
          <Text style={styles.eyebrow}>YOUR ORDER</Text>
          <Text style={styles.title}>Cart</Text>
        </View>
        <View style={styles.countPill}><Text style={styles.countText}>{totalItems}</Text></View>
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
          </ScrollView>

          <View style={[styles.summary, { paddingBottom: insets.bottom + 14 }]}>
            <View>
              <Text style={styles.totalLabel}>{totalItems} {totalItems === 1 ? 'item' : 'items'}</Text>
              <Text style={styles.totalPrice}>₹{totalPrice}</Text>
            </View>
            <View style={styles.checkoutButton}>
              <Text style={styles.checkoutText}>Proceed to checkout</Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FBFAF8' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 20, gap: 14 },
  backButton: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#FFFFFF', borderWidth: StyleSheet.hairlineWidth, borderColor: '#DEDAD4', alignItems: 'center', justifyContent: 'center' },
  backIcon: { color: '#222226', fontSize: 35, lineHeight: 37, marginTop: -4 },
  eyebrow: { color: ORANGE, fontSize: 9, fontWeight: '900', letterSpacing: 1.1 },
  title: { color: '#1B1B1E', fontSize: 26, fontWeight: '900', marginTop: 2 },
  countPill: { marginLeft: 'auto', minWidth: 34, height: 34, borderRadius: 17, backgroundColor: '#FFF0E9', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 9 },
  countText: { color: ORANGE, fontSize: 13, fontWeight: '900' },
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
  checkoutText: { color: '#FFFFFF', fontSize: 14, fontWeight: '900' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 34, paddingBottom: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 18 },
  emptyTitle: { color: '#222226', fontSize: 22, fontWeight: '900' },
  emptyCopy: { color: '#77767B', fontSize: 13, lineHeight: 20, textAlign: 'center', marginTop: 8 },
  browseButton: { marginTop: 22, borderRadius: 15, backgroundColor: ORANGE, paddingHorizontal: 22, paddingVertical: 14 },
  browseText: { color: '#FFFFFF', fontSize: 13, fontWeight: '900' },
  pressed: { opacity: 0.7 },
});
