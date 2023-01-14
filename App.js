import { FontAwesome } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Switch } from "react-native-switch";
import { DataTable } from "react-native-paper";
import {
  ref,
  onValue,
  query,
  limitToLast,
  orderByKey,
  update,
} from "firebase/database";
import { db } from "./firebaseConfig";

export default function App() {
  const [isLampEnable, setIsLampEnable] = useState();
  const [rLed, setRled] = useState(0);
  const [gLed, setGled] = useState(0);
  const [bLed, setBled] = useState(0);

  const [currentTime, setCurrentTime] = useState("");
  const [dht, setDht] = useState([
    {
      temp: 0,
      hum: 0,
    },
  ]);

  function getDate() {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const date = new Date();
    return date.toDateString("id-ID", options).toString();
  }

  function toggleSwithLamp() {
    setIsLampEnable(!isLampEnable);
    const updates = {};
    updates["control/rgb-led/enable"] = !isLampEnable;
    update(ref(db), updates);
  }

  function slider() {
    const updates = {};
    updates["control/rgb-led/R"] = rLed;
    updates["control/rgb-led/G"] = gLed;
    updates["control/rgb-led/B"] = bLed;
    update(ref(db), updates);
  }
  useEffect(() => {
    const exec = query(ref(db, "dht"), limitToLast(5), orderByKey());
    return onValue(exec, (snapshot) => {
      const data = snapshot.val();

      if (snapshot.exists()) {
        dht.shift();
        Object.values(data).map((db, index) => {
          setDht((dht) => [db, ...dht.slice(0, 4)]);
        });
      }
    });
  }, []);

  useEffect(() => {
    const q = query(ref(db, "control/rgb-led"));
    return onValue(q, (snapshot) => {
      const data = snapshot.val();

      if (snapshot.exists()) {
        setIsLampEnable(data.enable);
        setRled(data.R);
        setGled(data.G);
        setBled(data.B);
      }
    });
  }, []);

  useEffect(() => {
    setInterval(() => {
      function add0String(value) {
        if (value < 10) {
          return `0${value}`;
        }
        return `${value}`;
      }
      const getHour = add0String(new Date().getHours());
      const getMinutes = add0String(new Date().getMinutes());
      const getSeconds = add0String(new Date().getSeconds());
      setCurrentTime(`${getHour}:${getMinutes}:${getSeconds}`);
    }, 900);
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.jumboTron}>
        <Text style={styles.title}>Welcome</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.melayang}>
          <Text style={styles.jam}>{currentTime}</Text>
          <Text style={styles.tanggal}>{getDate()}</Text>
        </View>

        {/* Box content */}
        <View style={styles.boxContent}>
          <View style={styles.boxContainer}>
            <View style={styles.boxCol}>
              <View style={styles.box}>
                <View
                  style={{
                    display: "flex",
                    flex: 1,
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignItems: "flex-start",
                  }}
                >
                  <View
                    style={{
                      width: "80%",
                    }}
                  >
                    <Text
                      style={{
                        color: "#24C48E",
                        textAlignVertical: "center",
                        marginTop: 5,
                      }}
                    >
                      <FontAwesome name="lightbulb-o" size={20}>
                        {"  "} Lampu RGB
                      </FontAwesome>
                    </Text>
                  </View>
                  <Switch
                    disabled={false}
                    activeText={"On"}
                    inActiveText={"Off"}
                    r
                    onValueChange={toggleSwithLamp}
                    value={isLampEnable}
                    switchBorderRadius={15}
                    circleSize={28}
                  />
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Text style={{ color: "white" }}>R</Text>
                  <Slider
                    style={{ height: 30, flex: 2 }}
                    minimumValue={0}
                    value={rLed}
                    maximumValue={255}
                    minimumTrackTintColor="#24C48E"
                    maximumTrackTintColor="#FFFFFF"
                    onSlidingComplete={(value) => {
                      setRled(Math.round(value));
                      slider();
                    }}
                  />
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Text style={{ color: "white" }}>G</Text>
                  <Slider
                    style={{ height: 30, flex: 2 }}
                    minimumValue={0}
                    maximumValue={255}
                    minimumTrackTintColor="#24C48E"
                    value={gLed}
                    maximumTrackTintColor="#FFFFFF"
                    onSlidingComplete={(value) => {
                      setGled(Math.round(value));
                      slider();
                    }}
                  />
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Text style={{ color: "white" }}>B</Text>
                  <Slider
                    style={{ height: 30, flex: 2 }}
                    minimumValue={0}
                    maximumValue={255}
                    value={bLed}
                    minimumTrackTintColor="#24C48E"
                    maximumTrackTintColor="#FFFFFF"
                    onSlidingComplete={(value) => {
                      setBled(Math.round(value));
                      slider();
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
          <View style={styles.boxContainer2}>
            <View style={styles.boxCol}>
              <View style={styles.box}>
                <Text
                  style={{
                    color: "#24C48E",
                    textAlignVertical: "center",
                    marginTop: 5,
                    fontSize: 20,
                  }}
                >
                  Monitoring
                </Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    paddingBottom: 10,
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <Text style={styles.subTitle}>Temperature</Text>
                    <View style={{ flexDirection: "row" }}>
                      <FontAwesome
                        name="thermometer-0"
                        size={42}
                        style={{ color: "#24C48E" }}
                      />
                      <Text
                        style={{
                          color: "#24C48E",
                          alignSelf: "center",
                          fontSize: 22,
                        }}
                      >
                        {"  "}
                        {dht[0].temp === undefined ? "null" : dht[0].temp}
                        {"°C"}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <Text style={styles.subTitle}>Humidity</Text>
                    <View style={{ flexDirection: "row", flex: 1 }}>
                      <FontAwesome
                        name="tint"
                        size={42}
                        style={{ color: "#24C48E" }}
                      />
                      <Text
                        style={{
                          color: "#24C48E",
                          alignSelf: "center",
                          fontSize: 22,
                        }}
                      >
                        {"  "}
                        {dht[0].temp === undefined ? "null" : dht[0].hum}
                        {"%"}
                      </Text>
                    </View>
                  </View>
                </View>
                <ScrollView>
                  <DataTable style={styles.tableContainer}>
                    <DataTable.Header style={styles.tableHeader}>
                      <DataTable.Title>
                        <Text style={{ color: "#24C48E" }}>Temperature</Text>
                      </DataTable.Title>
                      <DataTable.Title>
                        <Text style={{ color: "#24C48E" }}>Humidity</Text>
                      </DataTable.Title>
                    </DataTable.Header>
                    {dht.map((dhtValue, index) => (
                      <DataTable.Row key={index}>
                        <DataTable.Cell>
                          <Text key={index} style={{ color: "#24C48E" }}>
                            {dhtValue.temp}
                          </Text>
                        </DataTable.Cell>
                        <DataTable.Cell>
                          <Text key={index} style={{ color: "#24C48E" }}>
                            {dhtValue.hum}
                          </Text>
                        </DataTable.Cell>
                      </DataTable.Row>
                    ))}
                  </DataTable>
                </ScrollView>
              </View>
            </View>
          </View>
        </View>
        {/* end of box content */}
        {/* <View style={styles.buttonConnectContainer}>
          <Button title="Connect" />
        </View> */}
      </View>
      <StatusBar hidden={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#24C48E",
    flex: 1,
  },
  tableContainer: {
    flex: 1,
    marginTop: 10,
  },
  jumboTron: {
    height: 98,
    borderColor: "#24C48E",
  },
  subTitle: {
    color: "#24C48E",
    marginVertical: 10,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 32,
    paddingStart: 24,
    marginTop: 18,
  },
  melayang: {
    backgroundColor: "#212226",
    marginStart: 30,
    marginEnd: 30,
    marginTop: -30,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4.84,
    elevation: 8,
    borderRadius: 20,
  },
  jam: {
    fontSize: 20,
    fontWeight: "600",
    opacity: 0.9,
    color: "#24C48E",
  },
  tanggal: {
    fontSize: 16,
    fontWeight: "400",
    opacity: 0.4,
    color: "#24C48E",
  },
  content: {
    backgroundColor: "#212226",
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  boxContent: {
    margin: 20,
    flex: 1,
    flexDirection: "column",
  },
  boxContainer: {
    flexDirection: "column",
    flex: 3,
  },
  boxContainer2: {
    flexDirection: "column",
    flex: 5.5,
    height: "50%",
  },
  boxCol: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
  },
  box: {
    flex: 2,
    borderRadius: 10,
    padding: 18,
    backgroundColor: "#212226",
    opacity: 0.6,
    borderColor: "#4E9F3D",
    borderStyle: "solid",
    borderWidth: 1,
  },
  buttonConnectContainer: {
    backgroundColor: "blue",
    marginBottom: 20,
    marginStart: 20,
    marginEnd: 20,
  },
});
