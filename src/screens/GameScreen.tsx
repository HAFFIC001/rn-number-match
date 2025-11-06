import React, { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Pressable,
  Alert,
} from "react-native";

import { LEVELS } from "../levels";
import {
  addRow,
  remainingUnmatched,
  seedGrid,
  tryMatch,
} from "../game/logic";
import type { Cell as CellType } from "../types";
import CellView from "../components/Cell";

const PAD = 12;

export default function GameScreen() {
  const [levelIndex, setLevelIndex] = useState(0);
  const level = LEVELS[levelIndex];

  const [grid, setGrid] = useState<CellType[]>([]);
  const [pool, setPool] = useState<number[]>([]);
  const [selected, setSelected] = useState<CellType | null>(null);
  const [invalidFlag, setInvalidFlag] = useState<string | null>(null);
  const [addLeft, setAddLeft] = useState(level.addRowLimit);
  const [timeLeft, setTimeLeft] = useState(level.timerSeconds);

  const cols = level.cols;

  /** Load level */
  useEffect(() => {
    const { grid, pool } = seedGrid(level);
    setGrid(grid);
    setPool(pool);
    setSelected(null);
    setAddLeft(level.addRowLimit);
    setTimeLeft(level.timerSeconds);
  }, [levelIndex]);

  /** Timer */
  useEffect(() => {
    const t = setInterval(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [levelIndex]);

  useEffect(() => {
    if (timeLeft <= 0) {
      Alert.alert("Time’s Up!", "Try Again.", [
        { text: "Retry", onPress: () => restart() },
      ]);
    }
  }, [timeLeft]);

  const restart = () => {
    const { grid, pool } = seedGrid(level);
    setGrid(grid);
    setPool(pool);
    setSelected(null);
    setAddLeft(level.addRowLimit);
    setTimeLeft(level.timerSeconds);
  };

  const size = useMemo(() => {
    const screen = Dimensions.get("window").width;
    const available = screen - PAD * 2;
    const s = Math.floor(available / cols) - 4;
    return Math.max(34, Math.min(56, s));
  }, [cols]);

  const onCellPress = (cell: CellType) => {
    if (!selected) {
      setSelected(cell);
      return;
    }

    if (selected.id === cell.id) {
      setSelected(null);
      return;
    }

    const { success, updated } = tryMatch(selected, cell, grid, cols);

    if (success) {
      setGrid(updated);
      setSelected(null);

      if (remainingUnmatched(updated) === 0) {
        if (levelIndex < LEVELS.length - 1) {
          Alert.alert("Level Complete!", "Move to next level?", [
            { text: "Next", onPress: () => setLevelIndex((i) => i + 1) },
          ]);
        } else {
          Alert.alert("Game Complete!", "Play again?", [
            { text: "Restart", onPress: () => setLevelIndex(0) },
          ]);
        }
      }
    } else {
      setInvalidFlag(cell.id + Date.now());
      setTimeout(() => setInvalidFlag(null), 250);
    }
  };

  const onAddRow = () => {
    if (addLeft <= 0) return;

    const result = addRow(grid, pool, level);
    setGrid(result.grid);
    setPool([...result.pool]);
    setAddLeft((x) => x - 1);
  };

  const header = (
    <View style={styles.header}>
      <View style={styles.badges}>
        <Text style={styles.level}>
          Level {level.id}: {level.name}
        </Text>
        <Text style={styles.timer}>
          ⏱ {Math.floor(timeLeft / 60)}:
          {String(timeLeft % 60).padStart(2, "0")}
        </Text>
      </View>

      <View style={styles.badges}>
        <Text style={styles.meta}>Add Rows: {addLeft}</Text>
        <Text style={styles.meta}>Left: {remainingUnmatched(grid)}</Text>
      </View>

      <View style={styles.row}>
        <Pressable
          onPress={onAddRow}
          style={[styles.btn, addLeft <= 0 && styles.btnDisabled]}
          disabled={addLeft <= 0}
        >
          <Text style={styles.btnText}>+ Add Row</Text>
        </Pressable>

        <Pressable onPress={restart} style={styles.btnAlt}>
          <Text style={styles.btnText}>↻ Restart</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {header}

      <View style={styles.grid}>
        <FlatList
          /** ✅ FIX: Force FlatList to remount when column count changes */
          key={`grid-${levelIndex}-${cols}`}
          data={grid}
          numColumns={cols}
          keyExtractor={(c) => c.id}
          renderItem={({ item }) => (
            <CellView
              cell={item}
              size={size}
              selected={selected?.id === item.id}
              invalidPulse={invalidFlag === item.id}
              onPress={() => onCellPress(item)}
            />
          )}
          scrollEnabled={true}
          contentContainerStyle={{
            paddingHorizontal: PAD,
            paddingBottom: 120,
            gap: 6,
          }}
          columnWrapperStyle={{ gap: 6 }}
        />
      </View>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <Pressable
          onPress={() => setLevelIndex((i) => Math.max(0, i - 1))}
          style={[styles.navBtn, levelIndex === 0 && styles.btnDisabled]}
          disabled={levelIndex === 0}
        >
          <Text style={styles.btnText}>← Prev</Text>
        </Pressable>

        <Pressable
          onPress={() =>
            setLevelIndex((i) => Math.min(LEVELS.length - 1, i + 1))
          }
          style={[
            styles.navBtn,
            levelIndex === LEVELS.length - 1 && styles.btnDisabled,
          ]}
          disabled={levelIndex === LEVELS.length - 1}
        >
          <Text style={styles.btnText}>Next →</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0b1220" },
  header: { padding: 16, gap: 8 },
  badges: { flexDirection: "row", justifyContent: "space-between" },
  level: { color: "#f9fafb", fontSize: 18, fontWeight: "700" },
  timer: { color: "#fef3c7", fontSize: 18, fontWeight: "700" },
  meta: { color: "#9ca3af" },
  grid: { flex: 1 },
  row: { flexDirection: "row", gap: 10, marginTop: 8 },
  btn: {
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  btnAlt: {
    backgroundColor: "#374151",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  navBtn: {
    backgroundColor: "#334155",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    margin: 12,
  },
  btnText: { color: "#e5e7eb", fontWeight: "700" },
  btnDisabled: { opacity: 0.5 },
  footer: { flexDirection: "row", justifyContent: "space-between"},
});

