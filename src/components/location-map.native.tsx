import { useEffect, useRef } from 'react';
import MapView, { Marker, type MapPressEvent, type Region } from 'react-native-maps';
import { StyleSheet } from 'react-native';

export type MapCoordinate = { latitude: number; longitude: number };

type Props = {
  coordinate: MapCoordinate;
  onCoordinateChange: (coordinate: MapCoordinate) => void;
};

const regionFor = (coordinate: MapCoordinate): Region => ({
  ...coordinate,
  latitudeDelta: 0.004,
  longitudeDelta: 0.004,
});

export default function LocationMap({ coordinate, onCoordinateChange }: Props) {
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    mapRef.current?.animateToRegion(regionFor(coordinate), 500);
  }, [coordinate]);

  const handleMapPress = (event: MapPressEvent) => {
    onCoordinateChange(event.nativeEvent.coordinate);
  };

  return (
    <MapView
      ref={mapRef}
      style={StyleSheet.absoluteFill}
      initialRegion={regionFor(coordinate)}
      showsCompass={false}
      showsUserLocation
      showsMyLocationButton={false}
      onPress={handleMapPress}>
      <Marker
        coordinate={coordinate}
        draggable
        pinColor="#F76532"
        title="Delivery location"
        onDragEnd={(event) => onCoordinateChange(event.nativeEvent.coordinate)}
      />
    </MapView>
  );
}
