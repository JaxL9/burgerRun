import React, { useEffect, useRef, useState } from "react";
import { View, Text, Image, Animated, PanResponder, StyleSheet } from "react-native";

const LANES = [-120, 0, 120];

const IMAGES = {
  burger: require("./assets/burger.png"),
  donut: require("./assets/donut.png"),
  broccoli: require("./assets/broccoli.png"),
  weight: require("./assets/weight.png"),
};

const getItem = () => {
  const items = ["burger", "donut", "broccoli", "weight"];
  return items[Math.floor(Math.random() * items.length)];
};

export default function App() {
  const playerX = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const particle = useRef(new Animated.Value(0)).current;

  const [lane, setLane] = useState(1);
  const [weight, setWeight] = useState(50);
  const [level, setLevel] = useState(1);
  const [item, setItem] = useState(getItem());

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (_, g) => {
        if (g.dx > 40 && lane < 2) setLane(lane + 1);
        if (g.dx < -40 && lane > 0) setLane(lane - 1);
      },
    })
  ).current;

  // lane movement
  useEffect(() => {
    Animated.spring(playerX, {
      toValue: LANES[lane],
      useNativeDriver: true,
    }).start();
  }, [lane]);

  // scale (fat growth)
  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1 + weight / 400,
      useNativeDriver: true,
    }).start();
  }, [weight]);

  // particle burst animation
  const triggerParticle = () => {
    particle.setValue(0);

    Animated.timing(particle, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  // game loop
  useEffect(() => {
    const interval = setInterval(() => {
      const next = getItem();
      setItem(next);

      triggerParticle();

      setWeight((w) => {
        if (next === "burger") return w + 15;
        if (next === "donut") return w + 25;
        if (next === "broccoli") return w - 20;
        if (next === "weight") return w - 30;
        return w;
      });

      setLevel((l) => l + 1);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  // PARTICLE STYLE
  const particleStyle = {
    opacity: particle,
    transform: [
      {
        scale: particle.interpolate({
          inputRange: [0, 1],
          outputRange: [0.5, 2],
        }),
      },
      {
        translateY: particle.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -80],
        }),
      },
    ],
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Text style={styles.hud}>Level {level}</Text>
      <Text style={styles.hud}>Weight {weight}kg</Text>

      {/* TRACK */}
      <View style={styles.track}>

        {/* PLAYER */}
        <Animated.View
          style={[
            styles.player,
            {
              transform: [
                { translateX: playerX },
                { scale: scale },
              ],
            },
          ]}
        />

        {/* FOOD ITEM */}
        <View style={styles.itemWrap}>
          <Image source={IMAGES[item]} style={styles.food} />
        </View>

        {/* PARTICLES */}
        <Animated.View style={[styles.particle, particleStyle]}>
          <Text style={styles.particleText}>✨</Text>
        </Animated.View>

      </View>

      <Text style={styles.hint}>Swipe to move</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0d",
    alignItems: "center",
    justifyContent: "center",
  },

  hud: {
    color: "white",
    fontSize: 16,
  },

  track: {
    width: "100%",
    height: 350,
    alignItems: "center",
    justifyContent: "center",
  },

  player: {
    width: 50,
    height: 50,
    backgroundColor: "red",
    borderRadius: 25,
    position: "absolute",
    bottom: 100,
  },

  itemWrap: {
    position: "absolute",
    top: 40,
  },

  food: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },

  particle: {
    position: "absolute",
    bottom: 140,
  },

  particleText: {
    fontSize: 30,
  },

  hint: {
    color: "gray",
    marginTop: 20,
  },
});
