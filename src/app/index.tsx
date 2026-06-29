import { Image } from 'expo-image';
import { useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ORANGE = '#F76532';

const categories = [
  { name: 'All', icon: '🍽️' },
  { name: 'Pizza', icon: '🍕' },
  { name: 'Burgers', icon: '🍔' },
  { name: 'Asian', icon: '🍜' },
  { name: 'Healthy', icon: '🥗' },
];

const restaurants = [
  {
    id: '1',
    name: 'The Burger Club',
    cuisine: 'Burgers · American',
    rating: '4.8',
    time: '20–30 min',
    fee: 'Free delivery',
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '2',
    name: 'Napoli Pizza House',
    cuisine: 'Pizza · Italian',
    rating: '4.7',
    time: '25–35 min',
    fee: '₹29 delivery',
    image:
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '3',
    name: 'Green Bowl Kitchen',
    cuisine: 'Healthy · Salads',
    rating: '4.9',
    time: '15–25 min',
    fee: 'Free delivery',
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80',
  },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');

  const visibleRestaurants = useMemo(() => {
    const query = search.trim().toLowerCase();
    return restaurants.filter((restaurant) => {
      const matchesSearch =
        !query || `${restaurant.name} ${restaurant.cuisine}`.toLowerCase().includes(query);
      const matchesCategory =
        selectedCategory === 'All' ||
        restaurant.cuisine.toLowerCase().includes(selectedCategory.toLowerCase());
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="never"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 104 },
        ]}>
        <View style={styles.header}>
          <View>
            <Text style={styles.deliveryLabel}>DELIVER TO</Text>
            <Pressable style={styles.locationRow} accessibilityRole="button">
              <Text style={styles.locationPin}>●</Text>
              <Text style={styles.location}>Home · Koramangala</Text>
              <Text style={styles.chevron}>⌄</Text>
            </Pressable>
          </View>
          <Pressable style={styles.avatar} accessibilityLabel="Open profile">
            <Text style={styles.avatarText}>SK</Text>
          </Pressable>
        </View>

        <Text style={styles.greeting}>What would you like{`\n`}to eat today?</Text>

        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search food or restaurants"
            placeholderTextColor="#8B8B91"
            returnKeyType="search"
            style={styles.searchInput}
            accessibilityLabel="Search food or restaurants"
          />
          <Pressable style={styles.filterButton} accessibilityLabel="Open filters">
            <Text style={styles.filterIcon}>☷</Text>
          </Pressable>
        </View>

        <View style={styles.promoCard}>
          <View style={styles.promoCopy}>
            <Text style={styles.promoEyebrow}>YOUR FIRST ORDER</Text>
            <Text style={styles.promoTitle}>Get 50% off</Text>
            <Text style={styles.promoDescription}>Use code WELCOME50</Text>
          </View>
          <Text style={styles.promoEmoji}>🛵</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <Pressable><Text style={styles.seeAll}>See all</Text></Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}>
          {categories.map((category) => {
            const selected = selectedCategory === category.name;
            return (
              <Pressable
                key={category.name}
                onPress={() => setSelectedCategory(category.name)}
                style={({ pressed }) => [
                  styles.category,
                  selected && styles.categorySelected,
                  pressed && styles.pressed,
                ]}>
                <View style={[styles.categoryIcon, selected && styles.categoryIconSelected]}>
                  <Text style={styles.categoryEmoji}>{category.icon}</Text>
                </View>
                <Text style={[styles.categoryLabel, selected && styles.categoryLabelSelected]}>
                  {category.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular near you</Text>
          <Pressable><Text style={styles.seeAll}>See all</Text></Pressable>
        </View>

        <View style={styles.restaurantList}>
          {visibleRestaurants.map((restaurant) => (
            <Pressable key={restaurant.id} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
              <Image source={{ uri: restaurant.image }} style={styles.cardImage} contentFit="cover" transition={250} />
              <View style={styles.timeBadge}>
                <Text style={styles.timeText}>{restaurant.time}</Text>
              </View>
              <View style={styles.cardBody}>
                <View style={styles.restaurantHeading}>
                  <View style={styles.restaurantCopy}>
                    <Text style={styles.restaurantName}>{restaurant.name}</Text>
                    <Text style={styles.cuisine}>{restaurant.cuisine}</Text>
                  </View>
                  <View style={styles.rating}>
                    <Text style={styles.ratingText}>★ {restaurant.rating}</Text>
                  </View>
                </View>
                <Text style={styles.deliveryFee}>{restaurant.fee}</Text>
              </View>
            </Pressable>
          ))}
          {visibleRestaurants.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🔎</Text>
              <Text style={styles.emptyTitle}>No restaurants found</Text>
              <Text style={styles.emptyCopy}>Try another food or category.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FBFAF8' },
  content: { paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 26 },
  deliveryLabel: { color: ORANGE, fontSize: 11, fontWeight: '800', letterSpacing: 1.25, marginBottom: 5 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  locationPin: { color: ORANGE, fontSize: 10 },
  location: { color: '#171719', fontSize: 15, fontWeight: '700' },
  chevron: { color: '#67676C', fontSize: 16, marginTop: -4 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#222226', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  greeting: { color: '#19191B', fontSize: 32, lineHeight: 39, fontWeight: '800', letterSpacing: -0.9, marginBottom: 22 },
  searchBox: { height: 58, borderRadius: 18, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', paddingLeft: 17, paddingRight: 7, borderWidth: StyleSheet.hairlineWidth, borderColor: '#E8E6E1', ...Platform.select({ ios: { shadowColor: '#30291D', shadowOpacity: 0.06, shadowRadius: 14, shadowOffset: { width: 0, height: 5 } }, android: { elevation: 2 } }) },
  searchIcon: { color: '#28282B', fontSize: 27, width: 29, marginTop: -5 },
  searchInput: { flex: 1, color: '#171719', fontSize: 15, height: '100%' },
  filterButton: { width: 44, height: 44, borderRadius: 14, backgroundColor: ORANGE, alignItems: 'center', justifyContent: 'center' },
  filterIcon: { color: '#FFFFFF', fontSize: 20, transform: [{ rotate: '90deg' }] },
  promoCard: { minHeight: 132, overflow: 'hidden', borderRadius: 24, marginTop: 22, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#252329' },
  promoCopy: { zIndex: 1 },
  promoEyebrow: { color: '#F6A88D', fontSize: 10, fontWeight: '800', letterSpacing: 1.2, marginBottom: 7 },
  promoTitle: { color: '#FFFFFF', fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  promoDescription: { color: '#C8C5CB', fontSize: 13, marginTop: 6 },
  promoEmoji: { fontSize: 65, transform: [{ rotate: '-8deg' }], marginRight: 7 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 30, marginBottom: 15 },
  sectionTitle: { color: '#1B1B1E', fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  seeAll: { color: ORANGE, fontSize: 13, fontWeight: '700' },
  categoryList: { gap: 11, paddingRight: 20 },
  category: { width: 72, alignItems: 'center', gap: 8 },
  categorySelected: {},
  categoryIcon: { width: 62, height: 62, borderRadius: 20, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: StyleSheet.hairlineWidth, borderColor: '#E8E6E1' },
  categoryIconSelected: { backgroundColor: ORANGE, borderColor: ORANGE },
  categoryEmoji: { fontSize: 27 },
  categoryLabel: { color: '#6E6D72', fontSize: 12, fontWeight: '600' },
  categoryLabelSelected: { color: '#1D1D20', fontWeight: '800' },
  restaurantList: { gap: 18 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 22, overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth, borderColor: '#E9E7E2' },
  cardImage: { width: '100%', height: 175, backgroundColor: '#EEEAE4' },
  timeBadge: { position: 'absolute', top: 139, right: 12, backgroundColor: '#FFFFFF', borderRadius: 11, paddingHorizontal: 11, paddingVertical: 7 },
  timeText: { color: '#202024', fontSize: 11, fontWeight: '800' },
  cardBody: { padding: 15 },
  restaurantHeading: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  restaurantCopy: { flex: 1 },
  restaurantName: { color: '#19191C', fontSize: 17, fontWeight: '800', marginBottom: 5 },
  cuisine: { color: '#77767B', fontSize: 12 },
  rating: { backgroundColor: '#EDF7ED', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5 },
  ratingText: { color: '#27833A', fontSize: 11, fontWeight: '800' },
  deliveryFee: { color: ORANGE, fontSize: 11, fontWeight: '700', marginTop: 12 },
  pressed: { opacity: 0.72 },
  emptyState: { alignItems: 'center', paddingVertical: 34 },
  emptyEmoji: { fontSize: 34, marginBottom: 10 },
  emptyTitle: { color: '#222226', fontSize: 16, fontWeight: '800' },
  emptyCopy: { color: '#77767B', fontSize: 13, marginTop: 5 },
});
