import React, { useEffect, useRef, useState } from "react";
import { View, Text, PanResponder, Animated, StyleSheet } from "react-native";

const LANES = [-80, 0, 80];

const getRandomItem = () => {
  const items = ["burger", "donut", "broccoli", "weight"];
  return items[Math.floor(Math.random() * items.length)];
};

export default function App() {
  const playerX = useRef(new Animated.Value(0)).current;

  const [lane, setLane] = useState(1);
  const [weight, setWeight] = useState(50);
  const [level, setLevel] = useState(1);
  const [item, setItem] = useState(getRandomItem());
  const [gameOver, setGameOver] = useState(false);

  // swipe control
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 30 && lane < 2) {
          setLane(lane + 1);
        } else if (gesture.dx < -30 && lane > 0) {
          setLane(lane - 1);
        }
      },
    })
  ).current;

  // lane animation
  useEffect(() => {
    Animated.spring(playerX, {
      toValue: LANES[lane],
      useNativeDriver: true,
    }).start();
  }, [lane]);

  // game loop
  useEffect(() => {
    const interval = setInterval(() => {
      if (gameOver) return;

      const nextItem = getRandomItem();
      setItem(nextItem);

      if (nextItem === "burger") setWeight((w) => w + 10);
      if (nextItem === "donut") setWeight((w) => w + 20);
      if (nextItem === "broccoli") setWeight((w) => w - 15);
      if (nextItem === "weight") setWeight((w) => w - 25);

      setLevel((l) => l + 1);

      if (weight > 850) {
        setGameOver(true);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [weight, gameOver]);

  if (gameOver) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>YOU BROKE THE GROUND 💥</Text>
        <Text style={styles.text}>Final Weight: {weight} kg</Text>
        <Text style={styles.text}>Level Reached: {level}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Text style={styles.top}>Level {level}</Text>
      <Text style={styles.top}>Weight: {weight} kg</Text>

      <View style={styles.track}>
        <Animated.View
          style={[
            styles.player,
            { transform: [{ translateX: playerX }] },
          ]}
        />

        <View style={styles.item}>
          <Text style={styles.itemText}>{item.toUpperCase()}</Text>
        </View>
      </View>

      <Text style={styles.hint}>Swipe left / right</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },
  track: {
    width: "100%",
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  player: {
    width: 40,
    height: 40,
    backgroundColor: "red",
    borderRadius: 20,
  },
  item: {
    marginTop: 50,
  },
  itemText: {
    color: "white",
    fontSize: 20,
  },
  top: {
    color: "white",
    fontSize: 18,
    marginBottom: 10,
  },
  hint: {
    color: "gray",
    marginTop: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: 24,
    marginBottom: 10,
  },
  text: {
    color: "white",
  },
});
