import { StyleSheet, Text, View } from 'react-native';

export type MapCoordinate = { latitude: number; longitude: number };

type Props = {
  coordinate: MapCoordinate;
  onCoordinateChange: (coordinate: MapCoordinate) => void;
};

export default function LocationMap({ coordinate }: Props) {
  return (
    <View style={styles.map}>
      <View style={[styles.road, styles.roadOne]} />
      <View style={[styles.road, styles.roadTwo]} />
      <View style={[styles.road, styles.roadThree]} />
      <View style={styles.park} />
      <View style={styles.pinShadow} />
      <View style={styles.pin}>
        <View style={styles.pinCenter} />
      </View>
      <View style={styles.coordinates}>
        <Text style={styles.coordinatesText}>
          {coordinate.latitude.toFixed(5)}, {coordinate.longitude.toFixed(5)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1, overflow: 'hidden', backgroundColor: '#E8E4DC' },
  road: { position: 'absolute', backgroundColor: '#FCFBF8', borderColor: '#DDD8CF', borderWidth: 1 },
  roadOne: { width: '130%', height: 52, top: '34%', left: '-15%', transform: [{ rotate: '-13deg' }] },
  roadTwo: { width: 48, height: '130%', left: '27%', top: '-15%', transform: [{ rotate: '8deg' }] },
  roadThree: { width: 38, height: '130%', right: '18%', top: '-10%', transform: [{ rotate: '-6deg' }] },
  park: { position: 'absolute', width: 100, height: 72, right: 24, top: 26, borderRadius: 24, backgroundColor: '#CFE0C5' },
  pinShadow: { position: 'absolute', left: '50%', top: '50%', width: 30, height: 12, marginLeft: -15, marginTop: 18, borderRadius: 15, backgroundColor: 'rgba(42,32,24,0.18)' },
  pin: { position: 'absolute', left: '50%', top: '50%', width: 38, height: 38, marginLeft: -19, marginTop: -28, borderRadius: 19, borderBottomRightRadius: 4, backgroundColor: '#F76532', transform: [{ rotate: '45deg' }], alignItems: 'center', justifyContent: 'center' },
  pinCenter: { width: 13, height: 13, borderRadius: 7, backgroundColor: '#FFFFFF' },
  coordinates: { position: 'absolute', alignSelf: 'center', bottom: 15, backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
  coordinatesText: { color: '#5E5B58', fontSize: 10, fontWeight: '700' },
});
