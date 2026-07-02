import { Stack, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OFFERS } from '@/data/offers';

export default function OffersScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 28 },
        ]}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
            <Text style={styles.backIcon}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>All offers</Text>
          <View style={styles.headerSpacer} />
        </View>

        <Text style={styles.pageTitle}>Best deals for your next order</Text>
        <Text style={styles.pageSubtitle}>
          Browse every active offer and use the code that fits your order best.
        </Text>

        <View style={styles.offerList}>
          {OFFERS.map((offer) => (
            <View
              key={offer.code}
              style={[styles.offerCard, { backgroundColor: offer.backgroundColor }]}>
              <Text style={styles.offerEyebrow}>{offer.eyebrow}</Text>
              <View style={styles.offerTopRow}>
                <View style={styles.offerCopy}>
                  <Text style={styles.offerTitle}>{offer.title}</Text>
                  <Text style={styles.offerDescription}>{offer.description}</Text>
                </View>
                <Text style={styles.offerEmoji}>{offer.emoji}</Text>
              </View>
              <View style={styles.codePill}>
                <Text style={styles.codeLabel}>Code</Text>
                <Text style={styles.codeValue}>{offer.code}</Text>
              </View>
              <Text style={styles.offerMeta}>{offer.validTill}</Text>
              <Text style={styles.offerDetails}>{offer.details}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FBFAF8' },
  content: { paddingHorizontal: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E2DB',
  },
  backIcon: { color: '#1D1D20', fontSize: 22, fontWeight: '700' },
  headerTitle: { color: '#1B1B1E', fontSize: 18, fontWeight: '800' },
  headerSpacer: { width: 44, height: 44 },
  pageTitle: {
    color: '#19191B',
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  pageSubtitle: {
    color: '#6F6D73',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
    marginBottom: 24,
  },
  offerList: { gap: 16 },
  offerCard: {
    borderRadius: 28,
    padding: 20,
  },
  offerEyebrow: {
    color: '#F6A88D',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  offerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
  },
  offerCopy: { flex: 1 },
  offerTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  offerDescription: {
    color: '#D6D2DA',
    fontSize: 14,
    marginTop: 6,
  },
  offerEmoji: { fontSize: 56 },
  codePill: {
    marginTop: 18,
    alignSelf: 'flex-start',
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  codeLabel: {
    color: '#C8C5CB',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 2,
  },
  codeValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  offerMeta: {
    color: '#F7D9CC',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 16,
  },
  offerDetails: {
    color: '#E7E2EA',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
  },
  pressed: { opacity: 0.72 },
});
