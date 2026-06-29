import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = '@foodie/saved-addresses-v1';

export type DeliveryLocation = {
  latitude: number;
  longitude: number;
  city: string;
  region: string;
  formattedAddress: string;
  source: 'device' | 'manual' | 'saved';
};

export type SavedAddress = {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  latitude: number;
  longitude: number;
  house: string;
  street: string;
  area: string;
  landmark: string;
  city: string;
  region: string;
  postalCode: string;
  instructions: string;
  formattedAddress: string;
};

type Coordinate = { latitude: number; longitude: number };

type StoredAddresses = {
  addresses: SavedAddress[];
  selectedAddressId: string | null;
  deliveryLocation?: DeliveryLocation | null;
};

type AddressContextValue = {
  isHydrated: boolean;
  addresses: SavedAddress[];
  selectedAddress: SavedAddress | null;
  deliveryLocation: DeliveryLocation | null;
  saveAddress: (address: SavedAddress) => Promise<void>;
  selectNearestAddress: (coordinate: Coordinate) => Promise<SavedAddress | null>;
  setDeliveryLocation: (location: DeliveryLocation) => Promise<void>;
};

const AddressContext = createContext<AddressContextValue | null>(null);

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

const distanceInMeters = (from: Coordinate, to: Coordinate) => {
  const earthRadius = 6_371_000;
  const latitudeDelta = toRadians(to.latitude - from.latitude);
  const longitudeDelta = toRadians(to.longitude - from.longitude);
  const fromLatitude = toRadians(from.latitude);
  const toLatitude = toRadians(to.latitude);
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(fromLatitude) * Math.cos(toLatitude) * Math.sin(longitudeDelta / 2) ** 2;

  return earthRadius * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
};

export function AddressProvider({ children }: { children: ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [deliveryLocation, setDeliveryLocationState] = useState<DeliveryLocation | null>(null);

  useEffect(() => {
    let active = true;

    async function hydrate() {
      try {
        const storedValue = await AsyncStorage.getItem(STORAGE_KEY);
        if (!storedValue || !active) return;
        const stored = JSON.parse(storedValue) as StoredAddresses;
        const storedAddresses = Array.isArray(stored.addresses) ? stored.addresses : [];
        setAddresses(storedAddresses);
        setSelectedAddressId(
          storedAddresses.some((address) => address.id === stored.selectedAddressId)
            ? stored.selectedAddressId
            : storedAddresses[0]?.id ?? null,
        );
        setDeliveryLocationState(stored.deliveryLocation ?? null);
      } catch {
        // A corrupt local value should never block location onboarding.
      } finally {
        if (active) setIsHydrated(true);
      }
    }

    hydrate();
    return () => {
      active = false;
    };
  }, []);

  const persist = useCallback(async (
    nextAddresses: SavedAddress[],
    nextSelectedId: string | null,
    nextDeliveryLocation: DeliveryLocation | null,
  ) => {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        addresses: nextAddresses,
        selectedAddressId: nextSelectedId,
        deliveryLocation: nextDeliveryLocation,
      }),
    );
  }, []);

  const saveAddress = useCallback(
    async (address: SavedAddress) => {
      const nextAddresses = [...addresses.filter((item) => item.id !== address.id), address];
      const nextDeliveryLocation: DeliveryLocation = {
        latitude: address.latitude,
        longitude: address.longitude,
        city: address.city,
        region: address.region,
        formattedAddress: address.formattedAddress,
        source: 'saved',
      };
      setAddresses(nextAddresses);
      setSelectedAddressId(address.id);
      setDeliveryLocationState(nextDeliveryLocation);
      await persist(nextAddresses, address.id, nextDeliveryLocation);
    },
    [addresses, persist],
  );

  const selectNearestAddress = useCallback(
    async (coordinate: Coordinate) => {
      if (addresses.length === 0) return null;
      const nearest = addresses.reduce((closest, candidate) =>
        distanceInMeters(coordinate, candidate) < distanceInMeters(coordinate, closest)
          ? candidate
          : closest,
      );
      const nextDeliveryLocation: DeliveryLocation = {
        latitude: nearest.latitude,
        longitude: nearest.longitude,
        city: nearest.city,
        region: nearest.region,
        formattedAddress: nearest.formattedAddress,
        source: 'saved',
      };
      setSelectedAddressId(nearest.id);
      setDeliveryLocationState(nextDeliveryLocation);
      await persist(addresses, nearest.id, nextDeliveryLocation);
      return nearest;
    },
    [addresses, persist],
  );

  const setDeliveryLocation = useCallback(
    async (location: DeliveryLocation) => {
      setDeliveryLocationState(location);
      setSelectedAddressId(null);
      await persist(addresses, null, location);
    },
    [addresses, persist],
  );

  const selectedAddress = useMemo(
    () => addresses.find((address) => address.id === selectedAddressId) ?? null,
    [addresses, selectedAddressId],
  );

  const value = useMemo(
    () => ({
      isHydrated,
      addresses,
      selectedAddress,
      deliveryLocation,
      saveAddress,
      selectNearestAddress,
      setDeliveryLocation,
    }),
    [
      addresses,
      deliveryLocation,
      isHydrated,
      saveAddress,
      selectNearestAddress,
      selectedAddress,
      setDeliveryLocation,
    ],
  );

  return <AddressContext.Provider value={value}>{children}</AddressContext.Provider>;
}

export function useAddresses() {
  const context = useContext(AddressContext);
  if (!context) throw new Error('useAddresses must be used inside AddressProvider');
  return context;
}
