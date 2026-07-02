import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CartQuantityControl from '@/components/cart-quantity-control';
import { useCart } from '@/context/cart-context';
import { findRestaurant } from '@/data/restaurants';

const ORANGE = '#F76532';

export default function RestaurantScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const restaurantId = Array.isArray(params.id) ? params.id[0] : params.id;
  const restaurant = restaurantId ? findRestaurant(restaurantId) : null;
  const { totalItems, totalPrice } = useCart();
  const scrollRef = useRef<ScrollView>(null);
  const menuOffset = useRef(0);
  const categoryOffsets = useRef<Record<string, number>>({});
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = useMemo(
    () => Array.from(new Set(restaurant?.menu.map((item) => item.category) ?? [])),
    [restaurant],
  );
  const categoryGroups = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!restaurant) return [];
    return categories
      .map((category) => ({
        category,
        items: restaurant.menu.filter(
          (item) =>
            item.category === category &&
            (!query || `${item.name} ${item.description}`.toLowerCase().includes(query)),
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [categories, restaurant, search]);

  const scrollToCategory = (category: string) => {
    setActiveCategory(category);
    setSearch('');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const categoryOffset = category === 'All' ? 0 : categoryOffsets.current[category] ?? 0;
        scrollRef.current?.scrollTo({
          y: Math.max(0, menuOffset.current + categoryOffset - insets.top - 118),
          animated: true,
        });
      });
    });
  };

  if (!restaurant) {
    return (
      <View style={[styles.notFound, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <Text style={styles.notFoundTitle}>Restaurant not found</Text>
        <Pressable onPress={() => router.back()} style={styles.backHomeButton}>
          <Text style={styles.backHomeText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        stickyHeaderIndices={[2]}
        contentContainerStyle={{ paddingBottom: insets.bottom + (totalItems > 0 ? 104 : 28) }}>
        <View style={styles.hero}>
          <Image source={{ uri: restaurant.image }} style={styles.heroImage} contentFit="cover" transition={200} />
          <View style={styles.heroShade} />
          <View style={[styles.heroActions, { top: insets.top + 10 }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              onPress={() => router.back()}
              style={({ pressed }) => [styles.roundButton, pressed && styles.pressed]}>
              <Text style={styles.backIcon}>‹</Text>
            </Pressable>
            <View style={styles.locationHeader}>
              <Text style={styles.locationHeaderLabel}>RESTAURANT LOCATION</Text>
              <Text style={styles.locationHeaderText} numberOfLines={2}>{restaurant.address}</Text>
            </View>
          </View>
        </View>

        <View style={styles.restaurantInfo}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          <Text style={styles.cuisine}>{restaurant.cuisine}</Text>
          <View style={styles.metaRow}>
            <View style={styles.ratingPill}><Text style={styles.ratingText}>★ {restaurant.rating}</Text></View>
            <Text style={styles.metaText}>{restaurant.time}</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaText}>{restaurant.fee}</Text>
          </View>
        </View>

        <View style={styles.menuToolbar}>
          <View style={styles.menuSearchBox}>
            <Text style={styles.menuSearchIcon}>⌕</Text>
            <TextInput
              value={search}
              onChangeText={(value) => {
                setSearch(value);
                setActiveCategory('All');
              }}
              placeholder={`Search ${restaurant.name}`}
              placeholderTextColor="#99969B"
              returnKeyType="search"
              style={styles.menuSearchInput}
              accessibilityLabel={`Search items from ${restaurant.name}`}
            />
            {search.length > 0 && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Clear menu search"
                hitSlop={8}
                onPress={() => setSearch('')}
                style={styles.menuClearButton}>
                <Text style={styles.menuClearText}>×</Text>
              </Pressable>
            )}
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryTabs}>
            {['All', ...categories].map((category) => {
              const selected = activeCategory === category;
              return (
                <Pressable
                  key={category}
                  onPress={() => scrollToCategory(category)}
                  style={[styles.categoryTab, selected && styles.categoryTabSelected]}>
                  <Text style={[styles.categoryTabText, selected && styles.categoryTabTextSelected]}>
                    {category}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.menuHeader}>
          <Text style={styles.menuEyebrow}>FULL MENU</Text>
          <Text style={styles.menuTitle}>
            {search.trim() ? `Results for “${search.trim()}”` : 'Recommended for you'}
          </Text>
        </View>

        <View
          style={styles.menuList}
          onLayout={(event) => {
            menuOffset.current = event.nativeEvent.layout.y;
          }}>
          {categoryGroups.map((group) => (
            <View
              key={group.category}
              onLayout={(event) => {
                categoryOffsets.current[group.category] = event.nativeEvent.layout.y;
              }}>
              <View style={styles.categoryHeading}>
                <Text style={styles.categoryHeadingText}>{group.category}</Text>
                <Text style={styles.categoryCount}>{group.items.length} items</Text>
              </View>
              {group.items.map((item) => (
                <View key={item.id} style={styles.menuCard}>
                  <View style={styles.itemCopy}>
                    <View style={[styles.vegMark, !item.isVeg && styles.nonVegMark]}>
                      <View style={[styles.vegDot, !item.isVeg && styles.nonVegDot]} />
                    </View>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemPrice}>₹{item.price}</Text>
                    <Text style={styles.itemDescription} numberOfLines={3}>{item.description}</Text>
                  </View>
                  <View style={styles.itemVisual}>
                    <Image source={{ uri: item.image }} style={styles.itemImage} contentFit="cover" transition={150} />
                    <View style={styles.quantityControl}>
                      <CartQuantityControl restaurantId={restaurant.id} item={item} />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ))}
          {categoryGroups.length === 0 && (
            <View style={styles.noResults}>
              <Text style={styles.noResultsTitle}>No dishes found</Text>
              <Text style={styles.noResultsCopy}>Try a different item name or category.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {totalItems > 0 && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`View cart with ${totalItems} items`}
          onPress={() => router.push('/cart')}
          style={({ pressed }) => [
            styles.viewCart,
            { bottom: insets.bottom + 12 },
            pressed && styles.pressed,
          ]}>
          <View>
            <Text style={styles.viewCartCount}>{totalItems} {totalItems === 1 ? 'ITEM' : 'ITEMS'}</Text>
            <Text style={styles.viewCartTotal}>₹{totalPrice}</Text>
          </View>
          <Text style={styles.viewCartText}>View cart  →</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FBFAF8' },
  hero: { height: 260, backgroundColor: '#DDD7CF' },
  heroImage: { ...StyleSheet.absoluteFillObject },
  heroShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15,12,10,0.14)' },
  heroActions: { position: 'absolute', left: 18, right: 18, flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  roundButton: { width: 46, height: 46, borderRadius: 15, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#17120D', shadowOpacity: 0.16, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  locationHeader: { flex: 1, minHeight: 46, borderRadius: 15, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, paddingVertical: 6, shadowColor: '#17120D', shadowOpacity: 0.16, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  locationHeaderLabel: { color: ORANGE, fontSize: 8, lineHeight: 10, fontWeight: '900', letterSpacing: 0.7 },
  locationHeaderText: { color: '#29282C', fontSize: 11, lineHeight: 14, fontWeight: '700', textAlign: 'center', marginTop: 2 },
  backIcon: { color: '#222226', fontSize: 37, lineHeight: 39, marginTop: -4 },
  restaurantInfo: { backgroundColor: '#FBFAF8', borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -28, paddingHorizontal: 20, paddingTop: 23, paddingBottom: 22 },
  restaurantName: { color: '#19191C', fontSize: 27, lineHeight: 33, fontWeight: '900', letterSpacing: -0.6 },
  cuisine: { color: '#77767B', fontSize: 13, marginTop: 7 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 15, gap: 9 },
  ratingPill: { backgroundColor: '#E9F6E9', borderRadius: 9, paddingHorizontal: 9, paddingVertical: 6 },
  ratingText: { color: '#257B35', fontSize: 11, fontWeight: '900' },
  metaText: { color: '#55545A', fontSize: 12, fontWeight: '600' },
  metaDot: { color: '#AAA6A0', fontSize: 12 },
  menuToolbar: { backgroundColor: '#FBFAF8', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#DEDAD4', paddingTop: 8, paddingBottom: 10, shadowColor: '#342D26', shadowOpacity: 0.05, shadowRadius: 7, shadowOffset: { width: 0, height: 3 }, elevation: 3 },
  menuSearchBox: { height: 46, borderRadius: 15, backgroundColor: '#FFFFFF', borderWidth: StyleSheet.hairlineWidth, borderColor: '#DEDAD4', flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, paddingHorizontal: 13 },
  menuSearchIcon: { color: '#3A393D', fontSize: 23, marginRight: 8, marginTop: -3 },
  menuSearchInput: { flex: 1, height: '100%', color: '#222226', fontSize: 13 },
  menuClearButton: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#F0EDE8', alignItems: 'center', justifyContent: 'center' },
  menuClearText: { color: '#5E5B60', fontSize: 20, lineHeight: 22, marginTop: -2 },
  categoryTabs: { gap: 8, paddingHorizontal: 20, paddingTop: 10 },
  categoryTab: { height: 32, borderRadius: 16, backgroundColor: '#F0EDE8', paddingHorizontal: 14, alignItems: 'center', justifyContent: 'center' },
  categoryTabSelected: { backgroundColor: ORANGE },
  categoryTabText: { color: '#57545A', fontSize: 11, fontWeight: '800' },
  categoryTabTextSelected: { color: '#FFFFFF' },
  menuHeader: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 14 },
  menuEyebrow: { color: ORANGE, fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },
  menuTitle: { color: '#1D1D20', fontSize: 20, fontWeight: '900', marginTop: 6 },
  menuList: { paddingHorizontal: 20 },
  categoryHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, paddingBottom: 7 },
  categoryHeadingText: { color: '#202024', fontSize: 18, fontWeight: '900' },
  categoryCount: { color: '#8A878C', fontSize: 10, fontWeight: '700' },
  menuCard: { minHeight: 172, flexDirection: 'row', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#DEDAD4', paddingVertical: 20, gap: 16 },
  itemCopy: { flex: 1, paddingTop: 1 },
  vegMark: { width: 15, height: 15, borderWidth: 1.5, borderColor: '#27833A', alignItems: 'center', justifyContent: 'center', marginBottom: 7 },
  nonVegMark: { borderColor: '#A94A2D' },
  vegDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#27833A' },
  nonVegDot: { backgroundColor: '#A94A2D' },
  itemName: { color: '#242327', fontSize: 16, lineHeight: 21, fontWeight: '800' },
  itemPrice: { color: '#353438', fontSize: 13, fontWeight: '700', marginTop: 6 },
  itemDescription: { color: '#77767B', fontSize: 11, lineHeight: 16, marginTop: 8 },
  itemVisual: { width: 126, alignItems: 'center' },
  itemImage: { width: 126, height: 112, borderRadius: 17, backgroundColor: '#E7E2DB' },
  quantityControl: { marginTop: -19 },
  noResults: { alignItems: 'center', paddingVertical: 44 },
  noResultsTitle: { color: '#262529', fontSize: 17, fontWeight: '900' },
  noResultsCopy: { color: '#858287', fontSize: 12, marginTop: 7 },
  viewCart: { position: 'absolute', left: 16, right: 16, minHeight: 64, borderRadius: 18, backgroundColor: ORANGE, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, shadowColor: '#5C210D', shadowOpacity: 0.22, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 8 },
  viewCartCount: { color: '#FFE2D7', fontSize: 9, fontWeight: '900', letterSpacing: 0.8 },
  viewCartTotal: { color: '#FFFFFF', fontSize: 15, fontWeight: '900', marginTop: 2 },
  viewCartText: { color: '#FFFFFF', fontSize: 14, fontWeight: '900' },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  notFoundTitle: { color: '#222226', fontSize: 22, fontWeight: '900' },
  backHomeButton: { marginTop: 18, backgroundColor: ORANGE, borderRadius: 14, paddingHorizontal: 22, paddingVertical: 13 },
  backHomeText: { color: '#FFFFFF', fontWeight: '800' },
  pressed: { opacity: 0.72 },
});
