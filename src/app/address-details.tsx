import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAddresses } from '@/context/address-context';

const ORANGE = '#F76532';
const LABELS = ['Home', 'Work', 'Other'] as const;

type AddressParams = {
  latitude?: string;
  longitude?: string;
  street?: string;
  area?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  returnTo?: string;
};

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  optional?: boolean;
  multiline?: boolean;
  keyboardType?: 'default' | 'number-pad';
};

function AddressField({ label, optional, ...inputProps }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>
        {label}{optional && <Text style={styles.optional}>  Optional</Text>}
      </Text>
      <TextInput
        {...inputProps}
        placeholderTextColor="#A3A1A6"
        style={[styles.input, inputProps.multiline && styles.multilineInput]}
      />
    </View>
  );
}

export default function AddressDetailsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { saveAddress } = useAddresses();
  const params = useLocalSearchParams<AddressParams>();
  const [label, setLabel] = useState<(typeof LABELS)[number]>('Home');
  const [house, setHouse] = useState('');
  const [street, setStreet] = useState(params.street ?? '');
  const [area, setArea] = useState(params.area ?? '');
  const [city, setCity] = useState(params.city ?? '');
  const [region, setRegion] = useState(params.region ?? '');
  const [postalCode, setPostalCode] = useState(params.postalCode ?? '');
  const [instructions, setInstructions] = useState('');

  const canSave = Boolean(house.trim() && street.trim() && city.trim() && region.trim() && postalCode.trim());

  const handleSave = async () => {
    if (!canSave) return;
    const latitude = Number(params.latitude);
    const longitude = Number(params.longitude);
    const formattedAddress = [house, street, area, city, region, postalCode]
      .map((part) => part.trim())
      .filter(Boolean)
      .join(', ');

    await saveAddress({
      id: `${Date.now()}-${latitude.toFixed(5)}-${longitude.toFixed(5)}`,
      label,
      latitude,
      longitude,
      house: house.trim(),
      street: street.trim(),
      area: area.trim(),
      landmark: '',
      city: city.trim(),
      region: region.trim(),
      postalCode: postalCode.trim(),
      instructions: instructions.trim(),
      formattedAddress,
    });
    router.replace(params.returnTo === 'cart' ? '/cart' : '/home');
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 14, paddingBottom: insets.bottom + 110 }}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
            <Text style={styles.backArrow}>←</Text>
          </Pressable>
          <View style={styles.stepPill}><Text style={styles.stepText}>STEP 2 OF 2</Text></View>
        </View>

        <Text style={styles.eyebrow}>ALMOST THERE</Text>
        <Text style={styles.title}>Add address details</Text>
        <Text style={styles.subtitle}>Help your delivery partner find the right doorstep.</Text>

        <View style={styles.locationSummary}>
          <View style={styles.locationIcon}><Text style={styles.locationIconText}>●</Text></View>
          <View style={styles.locationCopy}>
            <Text style={styles.locationTitle} numberOfLines={2}>
              {[params.street, params.area, params.city].filter(Boolean).join(', ') || 'Selected map location'}
            </Text>
            <Text style={styles.coordinates}>
              {Number(params.latitude).toFixed(5)}, {Number(params.longitude).toFixed(5)}
            </Text>
          </View>
          <Pressable onPress={() => router.back()}><Text style={styles.changeText}>Change</Text></Pressable>
        </View>

        <Text style={styles.sectionLabel}>SAVE ADDRESS AS</Text>
        <View style={styles.labelRow}>
          {LABELS.map((item) => (
            <Pressable
              key={item}
              onPress={() => setLabel(item)}
              style={({ pressed }) => [styles.labelChip, label === item && styles.labelChipSelected, pressed && styles.pressed]}>
              <Text style={[styles.labelChipText, label === item && styles.labelChipTextSelected]}>{item}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.form}>
          <AddressField label="House / Flat / Floor" value={house} onChangeText={setHouse} placeholder="e.g. Flat 302, 3rd floor" />
          <AddressField label="Street" value={street} onChangeText={setStreet} placeholder="Street or building name" />
          <AddressField label="Area / Locality" value={area} onChangeText={setArea} placeholder="Area or neighbourhood" optional />
          <View style={styles.twoColumns}>
            <View style={styles.column}><AddressField label="City" value={city} onChangeText={setCity} placeholder="City" /></View>
            <View style={styles.column}><AddressField label="State" value={region} onChangeText={setRegion} placeholder="State" /></View>
          </View>
          <AddressField label="PIN code" value={postalCode} onChangeText={setPostalCode} placeholder="6-digit PIN code" keyboardType="number-pad" />
          <AddressField label="Delivery instructions" value={instructions} onChangeText={setInstructions} placeholder="Gate code, floor, directions…" optional multiline />
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <Pressable
          accessibilityRole="button"
          disabled={!canSave}
          onPress={handleSave}
          style={({ pressed }) => [styles.saveButton, !canSave && styles.saveButtonDisabled, pressed && styles.pressed]}>
          <Text style={styles.saveButtonText}>Save address & continue</Text>
          <Text style={styles.saveArrow}>→</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FBFAF8' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 24 },
  backButton: { width: 44, height: 44, borderRadius: 15, backgroundColor: '#FFFFFF', borderWidth: StyleSheet.hairlineWidth, borderColor: '#E5E2DC', alignItems: 'center', justifyContent: 'center' },
  backArrow: { color: '#27272A', fontSize: 23, marginTop: -2 },
  stepPill: { backgroundColor: '#27262A', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
  stepText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  eyebrow: { color: ORANGE, fontSize: 10, fontWeight: '800', letterSpacing: 1.3, marginHorizontal: 20, marginBottom: 8 },
  title: { color: '#19191B', fontSize: 30, lineHeight: 36, fontWeight: '800', letterSpacing: -0.7, marginHorizontal: 20 },
  subtitle: { color: '#77767B', fontSize: 14, lineHeight: 21, marginHorizontal: 20, marginTop: 8 },
  locationSummary: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF0E9', borderRadius: 20, padding: 14, marginHorizontal: 20, marginTop: 22 },
  locationIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  locationIconText: { color: ORANGE, fontSize: 17 },
  locationCopy: { flex: 1, paddingRight: 8 },
  locationTitle: { color: '#29272A', fontSize: 13, lineHeight: 18, fontWeight: '700' },
  coordinates: { color: '#8A7670', fontSize: 10, marginTop: 4 },
  changeText: { color: ORANGE, fontSize: 12, fontWeight: '800' },
  sectionLabel: { color: '#69676C', fontSize: 10, fontWeight: '800', letterSpacing: 1.1, marginHorizontal: 20, marginTop: 26, marginBottom: 11 },
  labelRow: { flexDirection: 'row', gap: 10, marginHorizontal: 20 },
  labelChip: { minWidth: 78, height: 42, paddingHorizontal: 18, borderRadius: 14, borderWidth: 1, borderColor: '#DEDAD3', backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  labelChipSelected: { borderColor: ORANGE, backgroundColor: '#FFF0E9' },
  labelChipText: { color: '#67656A', fontSize: 13, fontWeight: '700' },
  labelChipTextSelected: { color: ORANGE },
  form: { marginTop: 25, paddingHorizontal: 20, gap: 18 },
  field: { flex: 1 },
  fieldLabel: { color: '#333236', fontSize: 12, fontWeight: '800', marginBottom: 8 },
  optional: { color: '#99969C', fontSize: 10, fontWeight: '500' },
  input: { height: 54, borderRadius: 16, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E2DC', color: '#202024', fontSize: 14, paddingHorizontal: 15 },
  multilineInput: { height: 92, paddingTop: 15, textAlignVertical: 'top' },
  twoColumns: { flexDirection: 'row', gap: 12 },
  column: { flex: 1 },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#FBFAF8', paddingHorizontal: 20, paddingTop: 11, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#E3E0DA' },
  saveButton: { height: 58, borderRadius: 18, backgroundColor: ORANGE, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  saveButtonDisabled: { backgroundColor: '#D9D5D0' },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  saveArrow: { position: 'absolute', right: 20, color: '#FFFFFF', fontSize: 22 },
  pressed: { opacity: 0.72 },
});
