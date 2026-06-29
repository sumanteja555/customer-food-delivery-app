import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useCart } from '@/context/cart-context';
import type { MenuItem } from '@/data/restaurants';

type Props = {
  restaurantId: string;
  item: MenuItem;
};

const ORANGE = '#F76532';

export default function CartQuantityControl({ restaurantId, item }: Props) {
  const { addItem, decrementItem, incrementItem, quantityFor } = useCart();
  const quantity = quantityFor(item.id);

  if (quantity === 0) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Add ${item.name} to cart`}
        onPress={() => addItem(restaurantId, item)}
        style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}>
        <Text style={styles.addText}>ADD</Text>
        <Text style={styles.addPlus}>+</Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.stepper} accessibilityLabel={`${item.name}, quantity ${quantity}`}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Remove one ${item.name}`}
        hitSlop={8}
        onPress={() => decrementItem(item.id)}
        style={({ pressed }) => [styles.stepButton, pressed && styles.pressed]}>
        <Text style={styles.stepSymbol}>−</Text>
      </Pressable>
      <Text style={styles.quantity}>{quantity}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Add one more ${item.name}`}
        hitSlop={8}
        onPress={() => incrementItem(item.id)}
        style={({ pressed }) => [styles.stepButton, pressed && styles.pressed]}>
        <Text style={styles.stepSymbol}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: { width: 92, height: 40, borderRadius: 12, borderWidth: 1, borderColor: ORANGE, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  addText: { color: ORANGE, fontSize: 13, fontWeight: '900', letterSpacing: 0.5 },
  addPlus: { position: 'absolute', right: 7, top: 2, color: ORANGE, fontSize: 13, fontWeight: '800' },
  stepper: { width: 104, height: 40, borderRadius: 12, backgroundColor: ORANGE, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 5 },
  stepButton: { width: 28, height: 30, alignItems: 'center', justifyContent: 'center' },
  stepSymbol: { color: '#FFFFFF', fontSize: 20, lineHeight: 23, fontWeight: '700' },
  quantity: { minWidth: 22, color: '#FFFFFF', fontSize: 14, fontWeight: '900', textAlign: 'center' },
  pressed: { opacity: 0.68 },
});

