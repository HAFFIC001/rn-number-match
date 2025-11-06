import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from "react-native-reanimated";

type Props = {
  cell: { id: string; value: number; matched: boolean };
  size: number;
  selected: boolean;
  onPress: () => void;
  invalidPulse?: boolean;
};

export default function Cell({ cell, size, selected, onPress, invalidPulse }: Props) {
  const opacity = useSharedValue(cell.matched ? 0.35 : 1);
  const scale = useSharedValue(1);

  useEffect(() => {
    opacity.value = withTiming(cell.matched ? 0.35 : 1, { duration: 200 });
  }, [cell.matched]);

  useEffect(() => {
    if (invalidPulse) {
      scale.value = withSequence(
        withTiming(1.08, { duration: 90 }),
        withTiming(1.0, { duration: 90 }),
        withTiming(1.08, { duration: 90 }),
        withTiming(1.0, { duration: 90 })
      );
    }
  }, [invalidPulse]);

  const astyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }]
  }));

  const bg = selected ? "#10b981" : "#1f2937";
  const border = selected ? "#34d399" : "#374151";

  return (
    <Pressable onPress={onPress} disabled={cell.value === 0} style={{ width: size, height: size }}>
      <Animated.View style={[styles.box, astyle, { width: size, height: size, backgroundColor: bg, borderColor: border }]}>
        <Text style={[styles.text, cell.matched && styles.matched]}>{cell.value === 0 ? "" : cell.value}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10
  },
  text: {
    color: "#e5e7eb",
    fontSize: 20,
    fontWeight: "700"
  },
  matched: { color: "#9ca3af", textDecorationLine: "line-through" }
});