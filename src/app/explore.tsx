import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const cuisines = [
  { title: 'Indian', subtitle: '248 places', emoji: '🍛', color: '#FFF0E7' },
  { title: 'Italian', subtitle: '84 places', emoji: '🍝', color: '#FFF6DB' },
  { title: 'Asian', subtitle: '126 places', emoji: '🍜', color: '#EAF6EF' },
  { title: 'Desserts', subtitle: '93 places', emoji: '🍰', color: '#F9EBF1' },
  { title: 'Healthy', subtitle: '61 places', emoji: '🥗', color: '#EDF5E3' },
  { title: 'Beverages', subtitle: '112 places', emoji: '🧋', color: '#EEEAF9' },
];

export default function BrowseScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.screen}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom + 104 }}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>DISCOVER SOMETHING NEW</Text>
        <Text style={styles.title}>Browse cuisines</Text>
        <Text style={styles.subtitle}>From comfort food to fresh discoveries.</Text>
      </View>

      <View style={styles.grid}>
        {cuisines.map((cuisine) => (
          <Pressable
            key={cuisine.title}
            style={({ pressed }) => [
              styles.cuisineCard,
              { backgroundColor: cuisine.color },
              pressed && styles.pressed,
            ]}>
            <Text style={styles.emoji}>{cuisine.emoji}</Text>
            <Text style={styles.cuisineTitle}>{cuisine.title}</Text>
            <Text style={styles.cuisineSubtitle}>{cuisine.subtitle}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={({ pressed }) => [styles.offer, pressed && styles.pressed]}>
        <View>
          <Text style={styles.offerEyebrow}>WEEKEND SPECIAL</Text>
          <Text style={styles.offerTitle}>Free delivery</Text>
          <Text style={styles.offerCopy}>On orders above ₹299</Text>
        </View>
        <Text style={styles.offerArrow}>→</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FBFAF8', paddingHorizontal: 20 },
  header: { marginBottom: 26 },
  eyebrow: { color: '#F76532', fontSize: 10, fontWeight: '800', letterSpacing: 1.3, marginBottom: 8 },
  title: { color: '#19191B', fontSize: 32, lineHeight: 38, fontWeight: '800', letterSpacing: -0.8 },
  subtitle: { color: '#77767B', fontSize: 14, marginTop: 7 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  cuisineCard: { width: '48%', flexGrow: 1, minHeight: 156, borderRadius: 24, padding: 18, justifyContent: 'flex-end' },
  emoji: { fontSize: 38, position: 'absolute', top: 18, right: 18 },
  cuisineTitle: { color: '#202023', fontSize: 18, fontWeight: '800' },
  cuisineSubtitle: { color: '#727176', fontSize: 12, marginTop: 5 },
  offer: { minHeight: 124, borderRadius: 24, backgroundColor: '#252329', marginTop: 24, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  offerEyebrow: { color: '#F6A88D', fontSize: 10, fontWeight: '800', letterSpacing: 1.1, marginBottom: 7 },
  offerTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '800' },
  offerCopy: { color: '#C8C5CB', fontSize: 12, marginTop: 5 },
  offerArrow: { color: '#FFFFFF', fontSize: 28, marginRight: 6 },
  pressed: { opacity: 0.72 },
});
