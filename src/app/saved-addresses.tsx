import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAddresses } from '@/context/address-context';

const ORANGE = '#F76532';

export default function SavedAddressesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { addresses, selectedAddress } = useAddresses();

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}><Text style={styles.backIcon}>‹</Text></Pressable>
        <View><Text style={styles.eyebrow}>ACCOUNT</Text><Text style={styles.title}>Saved addresses</Text></View>
      </View>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 110 }]}>
        {addresses.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>⌖</Text>
            <Text style={styles.emptyTitle}>No saved addresses</Text>
            <Text style={styles.emptyCopy}>Add an address to make checkout quicker.</Text>
          </View>
        ) : addresses.map((address) => (
          <View key={address.id} style={[styles.addressCard, selectedAddress?.id === address.id && styles.addressCardSelected]}>
            <View style={styles.addressHeading}>
              <Text style={styles.addressLabel}>{address.label}</Text>
              {selectedAddress?.id === address.id && <Text style={styles.selectedPill}>SELECTED</Text>}
            </View>
            <Text style={styles.addressText}>{address.formattedAddress}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <Pressable
          onPress={() => router.push({ pathname: '/', params: { add: '1', details: '1', returnTo: 'home' } })}
          style={styles.addButton}>
          <Text style={styles.addButtonText}>Add new address</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FBFAF8' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingBottom: 20 },
  backButton: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#FFFFFF', borderWidth: StyleSheet.hairlineWidth, borderColor: '#DEDAD4', alignItems: 'center', justifyContent: 'center' },
  backIcon: { color: '#222226', fontSize: 35, lineHeight: 37, marginTop: -4 },
  eyebrow: { color: ORANGE, fontSize: 9, fontWeight: '900', letterSpacing: 1.1 },
  title: { color: '#1B1B1E', fontSize: 24, fontWeight: '900', marginTop: 2 },
  content: { flexGrow: 1, paddingHorizontal: 20, gap: 12 },
  addressCard: { borderRadius: 18, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2DED8', padding: 16 },
  addressCardSelected: { borderColor: ORANGE, backgroundColor: '#FFF8F4' },
  addressHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  addressLabel: { color: '#29282C', fontSize: 14, fontWeight: '900' },
  selectedPill: { color: ORANGE, fontSize: 8, fontWeight: '900', letterSpacing: 0.8 },
  addressText: { color: '#6F6D72', fontSize: 12, lineHeight: 18, marginTop: 8 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 80 },
  emptyIcon: { color: ORANGE, fontSize: 46 },
  emptyTitle: { color: '#222226', fontSize: 20, fontWeight: '900', marginTop: 15 },
  emptyCopy: { color: '#77767B', fontSize: 13, marginTop: 7 },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#FBFAF8', paddingHorizontal: 20, paddingTop: 11, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#E3E0DA' },
  addButton: { height: 58, borderRadius: 18, backgroundColor: ORANGE, alignItems: 'center', justifyContent: 'center' },
  addButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '900' },
});
