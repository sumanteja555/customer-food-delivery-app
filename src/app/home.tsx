import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Platform,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAddresses } from '@/context/address-context';
import { useCart } from '@/context/cart-context';
import { OFFERS } from '@/data/offers';
import { cityNamesMatch, findServiceCity, SERVICE_CITIES } from '@/data/service-cities';
import { RESTAURANTS, type MenuItem } from '@/data/restaurants';

const ORANGE = '#F76532';

// Legacy local offers data remains in the file encoding, but the screen uses shared OFFERS.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const offers = [
  { eyebrow: 'YOUR FIRST ORDER', title: 'Get 50% off', description: 'Use code WELCOME50', emoji: '🛵', backgroundColor: '#252329' },
  { eyebrow: 'FREE DELIVERY', title: 'Delivery is on us', description: 'Use code FREEDEL', emoji: '🍔', backgroundColor: '#193A35' },
  { eyebrow: 'WEEKEND SPECIAL', title: 'Save ₹150 today', description: 'Use code WEEKEND150', emoji: '🎉', backgroundColor: '#4A274F' },
];

function CartIcon() {
  return (
    <View style={styles.cartIconGraphic}>
      <View style={styles.cartIconHandle} />
      <View style={styles.cartIconBasket} />
      <View style={[styles.cartIconWheel, styles.cartIconWheelLeft]} />
      <View style={[styles.cartIconWheel, styles.cartIconWheelRight]} />
    </View>
  );
}

function FilterIcon({ active }: { active: boolean }) {
  const color = active ? '#FFFFFF' : '#555358';
  return (
    <View style={styles.filterGlyph}>
      <View style={styles.filterGlyphRow}>
        <View style={[styles.filterGlyphLine, { backgroundColor: color }]} />
        <View style={[styles.filterGlyphDot, { backgroundColor: color }]} />
      </View>
      <View style={styles.filterGlyphRow}>
        <View style={[styles.filterGlyphDot, { backgroundColor: color }]} />
        <View style={[styles.filterGlyphLine, { backgroundColor: color }]} />
      </View>
      <View style={styles.filterGlyphRow}>
        <View style={[styles.filterGlyphLine, { backgroundColor: color }]} />
        <View style={[styles.filterGlyphDot, { backgroundColor: color }]} />
      </View>
    </View>
  );
}

function SortIcon({ active }: { active: boolean }) {
  return <Text style={[styles.sortGlyph, active && styles.filterButtonTextActive]}>⇅</Text>;
}

const categories = [
  { name: 'All', icon: '🍽️' },
  { name: 'Pizza', icon: '🍕' },
  { name: 'Burgers', icon: '🍔' },
  { name: 'Asian', icon: '🍜' },
  { name: 'Healthy', icon: '🥗' },
];

const restaurantSummaries = [
  {
    id: '1',
    city: 'Bengaluru',
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
    city: 'Mumbai',
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
    city: 'Delhi',
    name: 'Green Bowl Kitchen',
    cuisine: 'Healthy · Salads',
    rating: '4.9',
    time: '15–25 min',
    fee: 'Free delivery',
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '4',
    city: 'Hyderabad',
    name: 'Deccan Spice Kitchen',
    cuisine: 'Indian · Biryani',
    rating: '4.8',
    time: '25–35 min',
    fee: '₹19 delivery',
    image:
      'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '5',
    city: 'Chennai',
    name: 'Marina Tiffin House',
    cuisine: 'Indian · South Indian',
    rating: '4.7',
    time: '20–30 min',
    fee: 'Free delivery',
    image:
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '6',
    city: 'Nandigama',
    name: 'Nandigama Spice Hub',
    cuisine: 'Indian · Biryani',
    rating: '4.6',
    time: '20–30 min',
    fee: 'Free delivery',
    image:
      'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '7',
    city: 'Nandigama',
    name: 'Highway Tiffins',
    cuisine: 'Indian · South Indian',
    rating: '4.4',
    time: '15–25 min',
    fee: '₹19 delivery',
    image:
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '8',
    city: 'Jaggayyapeta',
    name: 'Jaggayyapeta Food Court',
    cuisine: 'Indian · Multi-cuisine',
    rating: '4.5',
    time: '25–35 min',
    fee: 'Free delivery',
    image:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '9',
    city: 'Jaggayyapeta',
    name: 'Sri Balaji Meals',
    cuisine: 'Indian · Andhra Meals',
    rating: '4.7',
    time: '20–30 min',
    fee: '₹25 delivery',
    image:
      'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '10',
    city: 'Kanchikacherla',
    name: 'Kanchikacherla Kitchen',
    cuisine: 'Indian · Andhra',
    rating: '4.5',
    time: '20–30 min',
    fee: 'Free delivery',
    image:
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '11',
    city: 'Kanchikacherla',
    name: 'Village Pizza Point',
    cuisine: 'Pizza · Fast Food',
    rating: '4.3',
    time: '25–40 min',
    fee: '₹29 delivery',
    image:
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '12',
    city: 'Kodada',
    name: 'Kodad Biryani House',
    cuisine: 'Indian · Biryani',
    rating: '4.8',
    time: '20–35 min',
    fee: 'Free delivery',
    image:
      'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '13',
    city: 'Kodada',
    name: 'NH65 Burger Stop',
    cuisine: 'Burgers · Fast Food',
    rating: '4.4',
    time: '15–25 min',
    fee: '₹19 delivery',
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80',
  },
];

const restaurants = RESTAURANTS.length ? RESTAURANTS : restaurantSummaries;

type DietaryFilter = 'all' | 'veg' | 'nonVeg';
type SortOption = 'relevance' | 'costLowToHigh' | 'deliveryTime' | 'rating';

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Cost: Low to High', value: 'costLowToHigh' },
  { label: 'Delivery time', value: 'deliveryTime' },
  { label: 'Rating', value: 'rating' },
];

const getMenu = (restaurant: (typeof restaurants)[number]) =>
  'menu' in restaurant && Array.isArray(restaurant.menu)
    ? (restaurant.menu as MenuItem[])
    : [];

const getDeliveryMinutes = (time: string) => Number.parseInt(time, 10) || Number.MAX_SAFE_INTEGER;

const getLowestPrice = (restaurant: (typeof restaurants)[number]) => {
  const prices = getMenu(restaurant).map((item) => item.price);
  return prices.length ? Math.min(...prices) : Number.MAX_SAFE_INTEGER;
};

export default function RestaurantHomeScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const { deliveryLocation } = useAddresses();
  const { totalItems } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [activeOffer, setActiveOffer] = useState(0);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [dietaryFilter, setDietaryFilter] = useState<DietaryFilter>('all');
  const [minimumRating, setMinimumRating] = useState<number | null>(null);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const offerScrollRef = useRef<ScrollView>(null);
  const searchInputRef = useRef<TextInput>(null);
  const promoWidth = width - 40;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveOffer((current) => {
        const next = (current + 1) % OFFERS.length;
        offerScrollRef.current?.scrollTo({ x: next * promoWidth, animated: true });
        return next;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [promoWidth]);

  const displayedCity = deliveryLocation?.city || 'Choose location';
  const selectedServiceCity = deliveryLocation?.city
    ? findServiceCity(deliveryLocation.city)
    : null;

  const cuisineOptions = useMemo(
    () =>
      Array.from(
        new Set(
          restaurants.flatMap((restaurant) =>
            restaurant.cuisine.split(/\s*(?:Â·|·)\s*/).filter(Boolean),
          ),
        ),
      ).sort(),
    [],
  );

  const activeFilterCount =
    (dietaryFilter !== 'all' ? 1 : 0) +
    (minimumRating !== null ? 1 : 0) +
    selectedCuisines.length;

  const visibleRestaurants = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = restaurants.filter((restaurant) => {
      const matchesCity = Boolean(
        selectedServiceCity && cityNamesMatch(restaurant.city, selectedServiceCity.name),
      );
      const searchableText = [
        restaurant.name,
        restaurant.cuisine,
        ...('menu' in restaurant && Array.isArray(restaurant.menu)
          ? (restaurant.menu as MenuItem[]).flatMap((item) => [item.name, item.category, item.description])
          : []),
      ].join(' ').toLowerCase();
      const matchesSearch = !query || searchableText.includes(query);
      const matchesCategory =
        selectedCategory === 'All' ||
        restaurant.cuisine.toLowerCase().includes(selectedCategory.toLowerCase());
      const menu = getMenu(restaurant);
      const matchesDiet =
        dietaryFilter === 'all' ||
        (dietaryFilter === 'veg'
          ? menu.some((item) => item.isVeg)
          : menu.some((item) => !item.isVeg));
      const matchesRating = minimumRating === null || Number(restaurant.rating) >= minimumRating;
      const matchesCuisine =
        selectedCuisines.length === 0 ||
        selectedCuisines.some((cuisine) =>
          restaurant.cuisine.toLowerCase().includes(cuisine.toLowerCase()),
        );
      return matchesCity && matchesSearch && matchesCategory && matchesDiet && matchesRating && matchesCuisine;
    });

    return [...filtered].sort((first, second) => {
      if (sortBy === 'costLowToHigh') return getLowestPrice(first) - getLowestPrice(second);
      if (sortBy === 'deliveryTime') return getDeliveryMinutes(first.time) - getDeliveryMinutes(second.time);
      if (sortBy === 'rating') return Number(second.rating) - Number(first.rating);
      return 0;
    });
  }, [dietaryFilter, minimumRating, search, selectedCategory, selectedCuisines, selectedServiceCity, sortBy]);

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
            <Pressable
              style={styles.locationRow}
              accessibilityRole="button"
              accessibilityLabel="Change delivery city"
              onPress={() => router.push({ pathname: '/', params: { add: '1' } })}>
              <Text style={styles.locationPin}>●</Text>
              <Text style={styles.location} numberOfLines={1}>{displayedCity}</Text>
              <Text style={styles.chevron}>⌄</Text>
            </Pressable>
          </View>
        </View>

        <Modal
          animationType="slide"
          onRequestClose={() => setFilterMenuOpen(false)}
          transparent
          visible={filterMenuOpen}>
          <View style={styles.sheetBackdrop}>
            <Pressable
              accessibilityLabel="Close filters"
              onPress={() => setFilterMenuOpen(false)}
              style={StyleSheet.absoluteFill}
            />
            <View style={[styles.sheet, { paddingBottom: insets.bottom + 18 }]}>
              <View style={styles.sheetHandle} />
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>Filters</Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    setDietaryFilter('all');
                    setMinimumRating(null);
                    setSelectedCuisines([]);
                  }}>
                  <Text style={styles.clearFilters}>Clear all</Text>
                </Pressable>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.optionHeading}>Food preference</Text>
                <View style={styles.optionWrap}>
                  {([
                    ['all', 'All'],
                    ['veg', 'Veg'],
                    ['nonVeg', 'Non-veg'],
                  ] as const).map(([value, label]) => (
                    <Pressable
                      key={value}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: dietaryFilter === value }}
                      onPress={() => setDietaryFilter(value)}
                      style={[styles.optionChip, dietaryFilter === value && styles.optionChipSelected]}>
                      <Text style={[styles.optionChipText, dietaryFilter === value && styles.optionChipTextSelected]}>
                        {label}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <Text style={styles.optionHeading}>Rating</Text>
                <View style={styles.optionWrap}>
                  {([null, 3, 4, 4.5] as const).map((rating) => (
                    <Pressable
                      key={rating ?? 'any'}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: minimumRating === rating }}
                      onPress={() => setMinimumRating(rating)}
                      style={[styles.optionChip, minimumRating === rating && styles.optionChipSelected]}>
                      <Text style={[styles.optionChipText, minimumRating === rating && styles.optionChipTextSelected]}>
                        {rating === null ? 'Any rating' : `${rating}+ ★`}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <Text style={styles.optionHeading}>Cuisines</Text>
                <View style={styles.optionWrap}>
                  {cuisineOptions.map((cuisine) => {
                    const selected = selectedCuisines.includes(cuisine);
                    return (
                      <Pressable
                        key={cuisine}
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: selected }}
                        onPress={() =>
                          setSelectedCuisines((current) =>
                            selected
                              ? current.filter((item) => item !== cuisine)
                              : [...current, cuisine],
                          )
                        }
                        style={[styles.optionChip, selected && styles.optionChipSelected]}>
                        <Text style={[styles.optionChipText, selected && styles.optionChipTextSelected]}>
                          {cuisine}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </ScrollView>

              <Pressable
                accessibilityRole="button"
                onPress={() => setFilterMenuOpen(false)}
                style={styles.applyButton}>
                <Text style={styles.applyButtonText}>Show {visibleRestaurants.length} restaurants</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          onRequestClose={() => setSortMenuOpen(false)}
          transparent
          visible={sortMenuOpen}>
          <View style={styles.sheetBackdrop}>
            <Pressable
              accessibilityLabel="Close sort options"
              onPress={() => setSortMenuOpen(false)}
              style={StyleSheet.absoluteFill}
            />
            <View style={[styles.sheet, { paddingBottom: insets.bottom + 18 }]}>
              <View style={styles.sheetHandle} />
              <Text style={styles.sheetTitle}>Sort by</Text>
              <View style={styles.sortOptions}>
                {SORT_OPTIONS.map((option) => {
                  const selected = sortBy === option.value;
                  return (
                    <Pressable
                      key={option.value}
                      accessibilityRole="radio"
                      accessibilityState={{ selected }}
                      onPress={() => {
                        setSortBy(option.value);
                        setSortMenuOpen(false);
                      }}
                      style={styles.sortOption}>
                      <Text style={[styles.sortOptionText, selected && styles.sortOptionTextSelected]}>
                        {option.label}
                      </Text>
                      <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
                        {selected && <View style={styles.radioInner} />}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>
        </Modal>

        <Text style={styles.greeting}>What would you like{`\n`}to eat today?</Text>

        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            ref={searchInputRef}
            value={search}
            onChangeText={setSearch}
            placeholder="Search food or restaurants"
            placeholderTextColor="#8B8B91"
            returnKeyType="search"
            style={styles.searchInput}
            accessibilityLabel="Search food or restaurants"
          />
          <Pressable
            onPress={() => {
              if (search) setSearch('');
              searchInputRef.current?.focus();
            }}
            style={styles.searchButton}
            accessibilityLabel={search ? 'Clear search' : 'Search'}>
            <Text style={search ? styles.clearSearchIcon : styles.searchButtonIcon}>
              {search ? '×' : '⌕'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Offers for you</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Show all offers"
            onPress={() => router.push('/offers')}>
            <Text style={styles.seeAll}>Show offers</Text>
          </Pressable>
        </View>

        <View style={styles.promoContainer}>
          <ScrollView
            ref={offerScrollRef}
            horizontal
            pagingEnabled
            bounces={false}
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              setActiveOffer(Math.round(event.nativeEvent.contentOffset.x / promoWidth));
            }}>
            {OFFERS.map((offer) => (
              <View key={offer.title} style={[styles.promoCard, { width: promoWidth, backgroundColor: offer.backgroundColor }]}>
                <View style={styles.promoCopy}>
                  <Text style={styles.promoEyebrow}>{offer.eyebrow}</Text>
                  <Text style={styles.promoTitle}>{offer.title}</Text>
                  <Text style={styles.promoDescription}>{offer.description}</Text>
                </View>
                <Text style={styles.promoEmoji}>{offer.emoji}</Text>
              </View>
            ))}
          </ScrollView>
          <View style={styles.promoDots}>
            {OFFERS.map((offer, index) => (
              <View key={offer.title} style={[styles.promoDot, index === activeOffer && styles.promoDotActive]} />
            ))}
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <Pressable
            accessibilityLabel="Browse all categories"
            accessibilityRole="link"
            onPress={() => router.push('/explore')}>
            <Text style={styles.seeAll}>See all</Text>
          </Pressable>
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
          <Text style={styles.resultCount}>{visibleRestaurants.length} results</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterBar}>
          <Pressable
            accessibilityLabel={`Filters${activeFilterCount > 0 ? `, ${activeFilterCount} active` : ''}`}
            accessibilityRole="button"
            onPress={() => setFilterMenuOpen(true)}
            style={[styles.filterButton, activeFilterCount > 0 && styles.filterButtonActive]}>
            <FilterIcon active={activeFilterCount > 0} />
            <Text style={[styles.filterButtonText, activeFilterCount > 0 && styles.filterButtonTextActive]}>
              Filters
            </Text>
            {activeFilterCount > 0 ? (
              <View style={styles.activeCountBadge}>
                <Text style={styles.activeCountText}>{activeFilterCount}</Text>
              </View>
            ) : null}
          </Pressable>
          <Pressable
            accessibilityLabel={`Sort by ${SORT_OPTIONS.find((option) => option.value === sortBy)?.label}`}
            accessibilityRole="button"
            onPress={() => setSortMenuOpen(true)}
            style={[styles.filterButton, sortBy !== 'relevance' && styles.filterButtonActive]}>
            <SortIcon active={sortBy !== 'relevance'} />
            <Text style={[styles.filterButtonText, sortBy !== 'relevance' && styles.filterButtonTextActive]}>
              {sortBy === 'relevance'
                ? 'Sort'
                : SORT_OPTIONS.find((option) => option.value === sortBy)?.label}
            </Text>
          </Pressable>
        </ScrollView>

        <View style={styles.restaurantList}>
          {visibleRestaurants.map((restaurant) => (
            <Pressable
              key={restaurant.id}
              accessibilityRole="button"
              accessibilityLabel={`Open ${restaurant.name}`}
              onPress={() => router.push({ pathname: '/restaurant/[id]', params: { id: restaurant.id } })}
              style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
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
              <Text style={styles.emptyTitle}>
                {selectedServiceCity ? 'No restaurants found' : `We're not in ${displayedCity} yet`}
              </Text>
              <Text style={styles.emptyCopy}>
                {selectedServiceCity
                  ? 'Try another search or category.'
                  : `We currently deliver in ${SERVICE_CITIES.map((city) => city.name).join(', ')}.`}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      <Pressable
        style={({ pressed }) => [
          styles.floatingCart,
          { bottom: insets.bottom + 96 },
          pressed && styles.pressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel={`Open cart with ${totalItems} items`}
        onPress={() => router.push('/cart')}>
        <CartIcon />
        {totalItems > 0 && (
          <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>{totalItems}</Text></View>
        )}
      </Pressable>
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
  floatingCart: { position: 'absolute', right: 20, width: 60, height: 60, borderRadius: 21, backgroundColor: '#242428', alignItems: 'center', justifyContent: 'center', shadowColor: '#111114', shadowOpacity: 0.32, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 8 },
  cartIconGraphic: { width: 29, height: 27 },
  cartIconHandle: { position: 'absolute', top: 2, left: 1, width: 8, height: 4, borderTopWidth: 3, borderLeftWidth: 3, borderColor: '#FFFFFF', borderTopLeftRadius: 2 },
  cartIconBasket: { position: 'absolute', top: 6, left: 6, width: 21, height: 13, borderWidth: 3, borderTopWidth: 2, borderColor: '#FFFFFF', borderRadius: 4, transform: [{ skewX: '-8deg' }] },
  cartIconWheel: { position: 'absolute', bottom: 1, width: 5, height: 5, borderRadius: 3, backgroundColor: '#FFFFFF' },
  cartIconWheelLeft: { left: 9 },
  cartIconWheelRight: { right: 3 },
  cartBadge: { position: 'absolute', top: -5, right: -5, minWidth: 19, height: 19, borderRadius: 10, paddingHorizontal: 4, backgroundColor: ORANGE, alignItems: 'center', justifyContent: 'center' },
  cartBadgeText: { color: '#FFFFFF', fontSize: 9, fontWeight: '900' },
  greeting: { color: '#19191B', fontSize: 32, lineHeight: 39, fontWeight: '800', letterSpacing: -0.9, marginBottom: 22 },
  searchBox: { height: 58, borderRadius: 18, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', paddingLeft: 17, paddingRight: 7, borderWidth: StyleSheet.hairlineWidth, borderColor: '#E8E6E1', ...Platform.select({ ios: { shadowColor: '#30291D', shadowOpacity: 0.06, shadowRadius: 14, shadowOffset: { width: 0, height: 5 } }, android: { elevation: 2 } }) },
  searchIcon: { color: '#28282B', fontSize: 27, width: 29, marginTop: -5 },
  searchInput: { flex: 1, color: '#171719', fontSize: 15, height: '100%' },
  searchButton: { width: 44, height: 44, borderRadius: 14, backgroundColor: ORANGE, alignItems: 'center', justifyContent: 'center' },
  searchButtonIcon: { color: '#FFFFFF', fontSize: 27, lineHeight: 30, marginTop: -3 },
  clearSearchIcon: { color: '#FFFFFF', fontSize: 29, lineHeight: 31, fontWeight: '400', marginTop: -2 },
  promoContainer: { overflow: 'hidden', borderRadius: 24 },
  promoCard: { minHeight: 132, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  promoCopy: { zIndex: 1 },
  promoEyebrow: { color: '#F6A88D', fontSize: 10, fontWeight: '800', letterSpacing: 1.2, marginBottom: 7 },
  promoTitle: { color: '#FFFFFF', fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  promoDescription: { color: '#C8C5CB', fontSize: 13, marginTop: 6 },
  promoEmoji: { fontSize: 65, transform: [{ rotate: '-8deg' }], marginRight: 7 },
  promoDots: { position: 'absolute', bottom: 10, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 5 },
  promoDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.38)' },
  promoDotActive: { width: 15, backgroundColor: '#FFFFFF' },
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
  resultCount: { color: '#858287', fontSize: 12, fontWeight: '600' },
  filterBar: { gap: 8, paddingRight: 20, paddingBottom: 14 },
  filterButton: { height: 34, borderRadius: 17, borderWidth: StyleSheet.hairlineWidth, borderColor: '#E6DED6', backgroundColor: '#FFF8F4', paddingHorizontal: 11, flexDirection: 'row', alignItems: 'center', gap: 6 },
  filterButtonActive: { backgroundColor: ORANGE, borderColor: ORANGE },
  filterButtonText: { color: '#4A433F', fontSize: 12, fontWeight: '700' },
  filterButtonTextActive: { color: '#FFFFFF' },
  activeCountBadge: { minWidth: 18, height: 18, borderRadius: 9, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5, marginRight: -4 },
  activeCountText: { color: ORANGE, fontSize: 10, lineHeight: 12, fontWeight: '900' },
  filterGlyph: { width: 14, gap: 2 },
  filterGlyphRow: { height: 3, flexDirection: 'row', alignItems: 'center', gap: 2 },
  filterGlyphLine: { flex: 1, height: 2, borderRadius: 1 },
  filterGlyphDot: { width: 4, height: 4, borderRadius: 2 },
  sortGlyph: { color: '#625A55', fontSize: 16, lineHeight: 18, fontWeight: '800' },
  sheetBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(24,22,20,0.42)' },
  sheet: { maxHeight: '82%', borderTopLeftRadius: 28, borderTopRightRadius: 28, backgroundColor: '#FBFAF8', paddingHorizontal: 20, paddingTop: 10 },
  sheetHandle: { alignSelf: 'center', width: 42, height: 5, borderRadius: 3, backgroundColor: '#D4D0CA', marginBottom: 18 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sheetTitle: { color: '#1B1B1E', fontSize: 22, fontWeight: '900', letterSpacing: -0.4 },
  clearFilters: { color: ORANGE, fontSize: 13, fontWeight: '800' },
  optionHeading: { color: '#353438', fontSize: 14, fontWeight: '800', marginTop: 24, marginBottom: 12 },
  optionWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  optionChip: { minHeight: 40, justifyContent: 'center', borderRadius: 13, borderWidth: 1, borderColor: '#DDD9D3', backgroundColor: '#FFFFFF', paddingHorizontal: 14 },
  optionChipSelected: { borderColor: ORANGE, backgroundColor: '#FFF0E9' },
  optionChipText: { color: '#555358', fontSize: 13, fontWeight: '600' },
  optionChipTextSelected: { color: '#D84D1D', fontWeight: '800' },
  applyButton: { height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: ORANGE, marginTop: 24 },
  applyButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '900' },
  sortOptions: { marginTop: 12 },
  sortOption: { minHeight: 58, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E2DED8' },
  sortOptionText: { color: '#4B494E', fontSize: 15, fontWeight: '600' },
  sortOptionTextSelected: { color: '#1C1B1E', fontWeight: '900' },
  radioOuter: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#BDB8B1', alignItems: 'center', justifyContent: 'center' },
  radioOuterSelected: { borderColor: ORANGE },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: ORANGE },
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
