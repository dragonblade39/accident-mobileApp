import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import Svg, { Path } from "react-native-svg";

const History = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://accident-backend.onrender.com/history/data"
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const redirectToMaps = (latitude, longitude) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  const history = () => {
    navigation.navigate("Home");
  };

  const CustomLinkIcon = () => (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M21 12H3M21 12L12 3M21 12L12 21" />
    </Svg>
  );

  const Card = ({ item }) => {
    const accidentDate = new Date(item.date);
    const formattedDate = `${accidentDate.getDate()}/${
      accidentDate.getMonth() + 1
    }/${accidentDate.getFullYear()}`;
    const formattedTime = `${accidentDate.getHours()}:${accidentDate.getMinutes()}`;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          redirectToMaps(item.location.latitude, item.location.longitude)
        }
        onLongPress={() => handleDelete(item._id)}
      >
        <Text style={styles.cardText1}>Accident Detected!!</Text>
        <Text style={styles.cardText}>
          Lattitude:{" "}
          <Text style={styles.cardSub}>{item.location.latitude}</Text>
        </Text>
        <Text style={styles.cardText}>
          Longitude:{" "}
          <Text style={styles.cardSub}>{item.location.longitude}</Text>
        </Text>
        <Text style={styles.cardText}>
          Date: <Text style={styles.cardSub}>{formattedDate}</Text>
        </Text>
        <Text style={styles.cardText}>
          Time: <Text style={styles.cardSub}>{formattedTime}</Text>
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "white" }]}
            onPress={() =>
              redirectToMaps(item.location.latitude, item.location.longitude)
            }
          >
            <CustomLinkIcon />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const sortedData = [...data].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navbar}>
        <Text style={styles.heading}>Accidents History</Text>
        <TouchableOpacity style={styles.historyButton} onPress={history}>
          <Text style={styles.historyButtonText}>Home</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <View style={[styles.loadingContainer]}>
          <ActivityIndicator size="large" color="red" />
        </View>
      ) : (
        <FlatList
          data={sortedData}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <Card item={item} />}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E4E7EB",
    justifyContent: "center",
  },
  heading: {
    fontSize: 30,
    marginLeft: 10,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "red",
    padding: 16,
    margin: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  cardText1: { color: "white", fontWeight: "bold", fontSize: 25 },
  cardText: { color: "white", fontWeight: "bold", fontSize: 18 },
  cardSub: { fontWeight: "normal" },
  deleteButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "red",
    fontWeight: "bold",
  },
  historyButtonText: { color: "white", fontWeight: "bold" },
  historyButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  customIcon: {
    width: 24,
    height: 24,
    backgroundColor: "blue", // Add your desired background color or SVG here
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  button: {
    padding: 8,
    borderRadius: 4,
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default History;
