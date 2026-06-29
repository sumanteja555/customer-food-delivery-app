export type ServiceCity = {
  name: string;
  aliases: string[];
  latitude: number;
  longitude: number;
  region: string;
};

export const SERVICE_CITIES: ServiceCity[] = [
  {
    name: 'Nandigama',
    aliases: ['nandigama'],
    latitude: 16.7712,
    longitude: 80.2859,
    region: 'Andhra Pradesh',
  },
  {
    name: 'Jaggayyapeta',
    aliases: ['jaggayyapeta', 'jaggayapeta', 'jaggayyapet'],
    latitude: 16.8938,
    longitude: 80.0981,
    region: 'Andhra Pradesh',
  },
  {
    name: 'Kanchikacherla',
    aliases: ['kanchikacherla'],
    latitude: 16.6885,
    longitude: 80.3907,
    region: 'Andhra Pradesh',
  },
  {
    name: 'Kodada',
    aliases: ['kodad', 'kodada'],
    latitude: 16.9971,
    longitude: 79.9653,
    region: 'Telangana',
  },
];

const normalize = (value: string) => value.trim().toLocaleLowerCase();

export const findServiceCity = (query: string) => {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return null;

  return (
    SERVICE_CITIES.find(
      (city) =>
        normalize(city.name) === normalizedQuery ||
        city.aliases.some((alias) => normalize(alias) === normalizedQuery),
    ) ?? null
  );
};

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

const distanceInMeters = (
  from: { latitude: number; longitude: number },
  to: { latitude: number; longitude: number },
) => {
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

export const findNearestServiceCity = (coordinate: {
  latitude: number;
  longitude: number;
}) =>
  SERVICE_CITIES.reduce((nearest, candidate) =>
    distanceInMeters(coordinate, candidate) < distanceInMeters(coordinate, nearest)
      ? candidate
      : nearest,
  );

export const findNearbyServiceCity = (
  coordinate: { latitude: number; longitude: number },
  maximumDistanceInMeters = 20_000,
) => {
  const nearest = findNearestServiceCity(coordinate);
  return distanceInMeters(coordinate, nearest) <= maximumDistanceInMeters ? nearest : null;
};

export const cityNamesMatch = (left: string, right: string) => {
  const leftCity = findServiceCity(left);
  const rightCity = findServiceCity(right);
  return leftCity && rightCity
    ? leftCity.name === rightCity.name
    : normalize(left) === normalize(right);
};
