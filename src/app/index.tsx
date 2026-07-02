import * as Location from 'expo-location';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import LocationMap, { type MapCoordinate } from '@/components/location-map';
import { useAddresses } from '@/context/address-context';
import {
  findNearbyServiceCity,
  findNearestServiceCity,
  findServiceCity,
  SERVICE_CITIES,
  type ServiceCity,
} from '@/data/service-cities';

const ORANGE = '#F76532';
const DEFAULT_CITY = SERVICE_CITIES[0];

type ScreenState = 'initializing' | 'locating' | 'manual';

const formatGeocodedAddress = (address: Location.LocationGeocodedAddress) =>
  [
    [address.streetNumber, address.street || address.name].filter(Boolean).join(' '),
    address.district || address.subregion,
    address.city,
    address.region,
  ]
    .filter(Boolean)
    .join(', ');

export default function LocationSetupScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ add?: string; details?: string; returnTo?: string }>();
  const isChangingLocation = params.add === '1';
  const needsAddressDetails = params.details === '1';
  const shouldReturnToCart = params.returnTo === 'cart';
  const { deliveryLocation, isHydrated, setDeliveryLocation } = useAddresses();
  const hasStarted = useRef(false);
  const [screenState, setScreenState] = useState<ScreenState>('initializing');
  const [coordinate, setCoordinate] = useState<MapCoordinate>({
    latitude: DEFAULT_CITY.latitude,
    longitude: DEFAULT_CITY.longitude,
  });
  const [selectedCity, setSelectedCity] = useState<ServiceCity>(DEFAULT_CITY);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [canAskAgain, setCanAskAgain] = useState(true);
  const [canConfirmLocation, setCanConfirmLocation] = useState(true);

  const showManualPicker = useCallback((reason: string) => {
    const existingCity = deliveryLocation ? findServiceCity(deliveryLocation.city) : null;
    const initialCity = existingCity ?? DEFAULT_CITY;
    setCoordinate(
      deliveryLocation
        ? {
            latitude: deliveryLocation.latitude,
            longitude: deliveryLocation.longitude,
          }
        : { latitude: initialCity.latitude, longitude: initialCity.longitude },
    );
    setSelectedCity(initialCity);
    setSearch(deliveryLocation?.city || initialCity.name);
    setCanConfirmLocation(!deliveryLocation || Boolean(existingCity));
    setMessage(reason);
    setScreenState('manual');
  }, [deliveryLocation]);

  const locateUser = useCallback(async (previewOnMap = false) => {
    if (previewOnMap) {
      setMessage('Finding your current location…');
    } else {
      setScreenState('locating');
      setMessage('');
    }

    try {
      if (Platform.OS === 'android') {
        await Location.enableNetworkProviderAsync().catch(() => undefined);
      }

      const result = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const nextCoordinate = {
        latitude: result.coords.latitude,
        longitude: result.coords.longitude,
      };
      let address: Location.LocationGeocodedAddress | undefined;
      try {
        const matches = await Location.reverseGeocodeAsync(nextCoordinate);
        address = matches[0];
      } catch {
        // A GPS fix is still useful when the platform geocoder is temporarily unavailable.
      }
      const cityName = address?.city || address?.district || address?.subregion;
      const nearestServiceCity = findNearestServiceCity(nextCoordinate);
      const serviceCity =
        (cityName ? findServiceCity(cityName) : null) ?? findNearbyServiceCity(nextCoordinate);

      if (previewOnMap) {
        setCoordinate(nextCoordinate);
        if (serviceCity) {
          setSelectedCity(serviceCity);
          setSearch(serviceCity.name);
          setCanConfirmLocation(true);
          setMessage(`Your current location is near ${serviceCity.name}.`);
        } else {
          setSearch(cityName || 'Current location');
          setCanConfirmLocation(false);
          setMessage(
            `We're not at your current location yet. We currently deliver in ${SERVICE_CITIES.map((item) => item.name).join(', ')}.`,
          );
        }
        return;
      }

      await setDeliveryLocation({
        ...nextCoordinate,
        city: serviceCity?.name || cityName || 'Your area',
        region: address?.region || serviceCity?.region || nearestServiceCity.region,
        formattedAddress: address ? formatGeocodedAddress(address) : serviceCity?.name || 'Your area',
        source: 'device',
      });
      router.replace('/home');
    } catch {
      showManualPicker('We could not read your current location. Choose it on the map or type your city.');
    }
  }, [router, setDeliveryLocation, showManualPicker]);

  const requestPermissionAndLocate = useCallback(async (previewOnMap = false) => {
    if (!previewOnMap) setScreenState('initializing');
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      setCanAskAgain(permission.canAskAgain);
      if (permission.status !== Location.PermissionStatus.GRANTED) {
        showManualPicker('Location access was not allowed. Pin your location or type your city instead.');
        return;
      }
      await locateUser(previewOnMap);
    } catch {
      showManualPicker('Choose your delivery city on the map or type it below.');
    }
  }, [locateUser, showManualPicker]);

  useFocusEffect(useCallback(() => {
    if (!isHydrated || hasStarted.current) return;
    hasStarted.current = true;

    if (isChangingLocation) {
      showManualPicker('Move the pin or type a city to change your delivery location.');
    } else if (deliveryLocation) {
      router.replace('/home');
    } else {
      requestPermissionAndLocate();
    }

    return () => {
      // Tab screens stay mounted. Allow this setup flow to run again when the
      // user returns from the location button in the home header.
      hasStarted.current = false;
    };
  }, [
    deliveryLocation,
    isChangingLocation,
    isHydrated,
    requestPermissionAndLocate,
    router,
    showManualPicker,
  ]));

  const suggestions = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    if (!query || query === selectedCity.name.toLocaleLowerCase()) return [];
    return SERVICE_CITIES.filter(
      (city) =>
        city.name.toLocaleLowerCase().includes(query) ||
        city.aliases.some((alias) => alias.includes(query)),
    ).slice(0, 3);
  }, [search, selectedCity.name]);

  const chooseCity = (city: ServiceCity) => {
    setSelectedCity(city);
    setSearch(city.name);
    setCoordinate({ latitude: city.latitude, longitude: city.longitude });
    setCanConfirmLocation(true);
    setMessage('');
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCanConfirmLocation(false);
  };

  const submitSearch = () => {
    const city = findServiceCity(search);
    if (city) {
      chooseCity(city);
    } else {
      setCanConfirmLocation(false);
      setMessage(
        `We're not in ${search.trim() || 'that city'} yet. We currently deliver in ${SERVICE_CITIES.map((item) => item.name).join(', ')}.`,
      );
    }
  };

  const handleCoordinateChange = (nextCoordinate: MapCoordinate) => {
    const city = findNearbyServiceCity(nextCoordinate);
    setCoordinate(nextCoordinate);
    if (!city) {
      setCanConfirmLocation(false);
      setMessage(
        `We're not at this location yet. We currently deliver in ${SERVICE_CITIES.map((item) => item.name).join(', ')}.`,
      );
      return;
    }
    setSelectedCity(city);
    setSearch(city.name);
    setCanConfirmLocation(true);
    setMessage('The closest available delivery city to this pin is shown below.');
  };

  const confirmManualLocation = async () => {
    if (!canConfirmLocation) return;
    if (needsAddressDetails) {
      router.push({
        pathname: '/address-details',
        params: {
          latitude: String(coordinate.latitude),
          longitude: String(coordinate.longitude),
          city: selectedCity.name,
          region: selectedCity.region,
          returnTo: shouldReturnToCart ? 'cart' : 'home',
        },
      });
      return;
    }
    await setDeliveryLocation({
      ...coordinate,
      city: selectedCity.name,
      region: selectedCity.region,
      formattedAddress: `${selectedCity.name}, ${selectedCity.region}`,
      source: 'manual',
    });
    router.replace(shouldReturnToCart ? '/cart' : '/home');
  };

  if (screenState !== 'manual') {
    return (
      <View style={[styles.loadingScreen, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={styles.locatingIcon}><Text style={styles.locatingPin}>●</Text></View>
        <ActivityIndicator color={ORANGE} size="large" />
        <Text style={styles.loadingTitle}>
          {screenState === 'initializing' ? 'Checking location access' : 'Finding your city'}
        </Text>
        <Text style={styles.loadingCopy}>
          We use your city to show only restaurants that can deliver to you.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.mapArea}>
        <LocationMap coordinate={coordinate} onCoordinateChange={handleCoordinateChange} />
        <View style={[styles.mapHeader, { top: insets.top + 12 }]}>
          <View style={styles.manualPill}><Text style={styles.manualPillText}>CHOOSE LOCATION</Text></View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Use my current location"
            onPress={canAskAgain ? () => requestPermissionAndLocate(true) : Linking.openSettings}
            style={({ pressed }) => [styles.recenterButton, pressed && styles.pressed]}>
            <Text style={styles.recenterIcon}>⌖</Text>
          </Pressable>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        pointerEvents="box-none"
        style={styles.keyboardLayer}>
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.handle} />
          <Text style={styles.eyebrow}>DELIVERY LOCATION</Text>
          <Text style={styles.title}>Where should we deliver?</Text>
          <Text style={styles.helper}>{message}</Text>

          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>⌕</Text>
            <TextInput
              value={search}
              onChangeText={handleSearchChange}
              onSubmitEditing={submitSearch}
              placeholder="Type your city"
              placeholderTextColor="#929096"
              returnKeyType="search"
              style={styles.searchInput}
              accessibilityLabel="Type your delivery city"
            />
            {search.length > 0 && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Clear city search"
                hitSlop={8}
                onPress={() => {
                  setSearch('');
                  setMessage('');
                  setCanConfirmLocation(false);
                }}
                style={styles.clearSearchButton}>
                <Text style={styles.clearSearchText}>×</Text>
              </Pressable>
            )}
            <Pressable accessibilityRole="button" onPress={submitSearch} style={styles.searchButton}>
              <Text style={styles.searchButtonText}>Find</Text>
            </Pressable>
          </View>

          {suggestions.length > 0 && (
            <View style={styles.suggestions}>
              {suggestions.map((city) => (
                <Pressable key={city.name} onPress={() => chooseCity(city)} style={styles.suggestion}>
                  <Text style={styles.suggestionPin}>●</Text>
                  <View>
                    <Text style={styles.suggestionCity}>{city.name}</Text>
                    <Text style={styles.suggestionRegion}>{city.region}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          )}

          {!isChangingLocation && (
            <View style={styles.selectedCityRow}>
              <View>
                <Text style={styles.selectedLabel}>SELECTED CITY</Text>
                <Text style={styles.selectedCity}>{selectedCity.name}</Text>
              </View>
              <Text style={styles.selectedRegion}>{selectedCity.region}</Text>
            </View>
          )}

          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: !canConfirmLocation }}
            disabled={!canConfirmLocation}
            onPress={confirmManualLocation}
            style={({ pressed }) => [
              styles.confirmButton,
              !canConfirmLocation && styles.confirmButtonDisabled,
              pressed && styles.pressed,
            ]}>
            <Text style={styles.confirmButtonText}>
              {canConfirmLocation
                ? needsAddressDetails
                  ? 'Continue to address details'
                  : shouldReturnToCart
                    ? 'Use this delivery location'
                    : `Show restaurants in ${selectedCity.name}`
                : "We're not here yet"}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#E8E4DC' },
  loadingScreen: { flex: 1, backgroundColor: '#FBFAF8', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
  locatingIcon: { width: 82, height: 82, borderRadius: 41, backgroundColor: '#FFF0E9', alignItems: 'center', justifyContent: 'center', marginBottom: 28 },
  locatingPin: { color: ORANGE, fontSize: 28 },
  loadingTitle: { color: '#1B1B1E', fontSize: 23, fontWeight: '800', marginTop: 24, textAlign: 'center' },
  loadingCopy: { color: '#77767B', fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 10, maxWidth: 310 },
  mapArea: { flex: 1 },
  mapHeader: { position: 'absolute', left: 18, right: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  manualPill: { backgroundColor: 'rgba(35,34,37,0.88)', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
  manualPillText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  recenterButton: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#332A22', shadowOpacity: 0.14, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  recenterIcon: { color: '#262529', fontSize: 27, fontWeight: '700' },
  keyboardLayer: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#FBFAF8', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 20, paddingTop: 10 },
  handle: { width: 42, height: 4, borderRadius: 2, backgroundColor: '#D6D2CC', alignSelf: 'center', marginBottom: 18 },
  eyebrow: { color: ORANGE, fontSize: 10, fontWeight: '800', letterSpacing: 1.25, marginBottom: 7 },
  title: { color: '#19191B', fontSize: 25, lineHeight: 31, fontWeight: '800', letterSpacing: -0.5 },
  helper: { color: '#77767B', fontSize: 12, lineHeight: 17, marginTop: 5, minHeight: 34 },
  searchBox: { height: 54, borderRadius: 16, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', paddingLeft: 14, paddingRight: 5, borderWidth: StyleSheet.hairlineWidth, borderColor: '#DEDAD4', marginTop: 8 },
  searchIcon: { color: '#343337', fontSize: 24, marginRight: 8, marginTop: -4 },
  searchInput: { flex: 1, height: '100%', color: '#202024', fontSize: 14 },
  clearSearchButton: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#F0EDE8', alignItems: 'center', justifyContent: 'center', marginRight: 5 },
  clearSearchText: { color: '#5E5B60', fontSize: 20, lineHeight: 22, marginTop: -2 },
  searchButton: { height: 42, borderRadius: 12, backgroundColor: '#FFF0E9', paddingHorizontal: 15, alignItems: 'center', justifyContent: 'center' },
  searchButtonText: { color: ORANGE, fontSize: 12, fontWeight: '800' },
  suggestions: { backgroundColor: '#FFFFFF', borderRadius: 15, borderWidth: StyleSheet.hairlineWidth, borderColor: '#E2DED8', marginTop: 6, overflow: 'hidden' },
  suggestion: { minHeight: 48, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#ECE9E4' },
  suggestionPin: { color: ORANGE, fontSize: 9, marginRight: 10 },
  suggestionCity: { color: '#252428', fontSize: 13, fontWeight: '700' },
  suggestionRegion: { color: '#89878C', fontSize: 10, marginTop: 2 },
  selectedCityRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 13, borderWidth: StyleSheet.hairlineWidth, borderColor: '#E8E5DF' },
  selectedLabel: { color: ORANGE, fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  selectedCity: { color: '#222226', fontSize: 17, fontWeight: '800', marginTop: 3 },
  selectedRegion: { color: '#77767B', fontSize: 12, fontWeight: '600' },
  confirmButton: { minHeight: 56, borderRadius: 18, backgroundColor: ORANGE, alignItems: 'center', justifyContent: 'center', marginTop: 12, paddingHorizontal: 18 },
  confirmButtonDisabled: { backgroundColor: '#A9A6A2' },
  confirmButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800', textAlign: 'center' },
  pressed: { opacity: 0.72 },
});
