import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import React, { useContext, useEffect, useState, useCallback } from "react";
import { AppContext } from "./context/AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, useNavigation } from "expo-router";

const home = () => {
  const { token,user, setToken, website } = useContext(AppContext);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [time, setTime] = useState(null);
  const [editBoolean, setEditBoolean] = useState(false);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(false);
  const [carryName, setCarryName] = useState("");

  const handleLogout = () => {
    setToken(null);
  };

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity style={{ padding: 12,flexDirection:"row",alignItems:"center",justifyContent:"center" }} onPress={handleLogout}>
            <Text style={{margin:8}}> {user.name} </Text>
            <Ionicons name="log-out" size={25} color="red" />
          </TouchableOpacity>
        ),
      });
    }, [navigation])
  );

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(website + "/api/folders", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const userData = await response.json();
      setFolders(userData);
      setLoading(false);
      // console.log('User Data:', userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [time]); // Fetch data on component mount

  const createData = async (name) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(website + "/api/folders", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const userData = await response.json();
      console.log("User Data:", userData);
      setTime(Date.now().toString());
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const destroyData = async (folderId) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(website + `/api/folders/${folderId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const userData = await response.json();
      setTime(Date.now().toString());
      console.log("delete successfully");
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const updateData = async (folderId, name) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(website + `/api/folders/${folderId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const userData = await response.json();
      console.log("update successfully");
      setTime(Date.now().toString());
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      {loading && (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View
            style={{
              width: 300,
              padding: 30,
              backgroundColor: "black",
              borderRadius: 20,
            }}
          >
            <View
              style={{ padding: 4, borderWidth: 2, borderBottomColor: "white" }}
            >
              <Text style={{ fontSize: 18, marginBottom: 20, color: "white" }}>
                Select an Option ?
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                setEditBoolean(true);
                setName(carryName);
                setModalVisible(false);
              }}
            >
              <Text style={{ padding: 10, fontSize: 16, color: "white" }}>
                Update
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                destroyData(selectedPost);
                setModalVisible(false);
              }}
            >
              <Text style={{ padding: 10, fontSize: 16, color: "white" }}>
                Remove
              </Text>
            </TouchableOpacity>
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      <FlatList
        data={folders}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          return (
            <View style={styles.item}>
              <TouchableOpacity
                style={styles.part}
                onPress={() => {
                  router.push("(notes)/" + item.id);
                }}
              >
                <Ionicons name="folder" size={50} color="#f9cd41" />
                <Text style={{ margin: 12 }}>{item.name}</Text>
              </TouchableOpacity>
              <View style={styles.crudPart}>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(true);
                    setCarryName(item.name);
                    setSelectedPost(item.id);
                  }}
                >
                  <Ionicons name="ellipsis-vertical" size={25} color="back" />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
      <View style={styles.addContainer}>
        <View style={{ flexDirection: "row" }}>
          <TextInput
            style={styles.textinput}
            placeholder="name"
            value={name}
            onChangeText={(text) => {
              setName(text);
            }}
          />
        </View>

        <TouchableOpacity onPress={() => {}}>
          <Button
            title={editBoolean ? "SUBMIT" : "ADD"}
            onPress={() => {
              if (editBoolean) {
                updateData(selectedPost, name);
              } else {
                createData(name);
              }
              setName("");
              //refresh
              setEditBoolean(false);
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  flatList: {
    width: "100%",
    maxWidth: 500,
  },
  part: {
    width: 200,
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  crudPart: {
    width: 100,
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingRight: 20,
  },
  textinput: {
    padding: 8,
    margin: 10,
    width: 250,
    borderRadius: 10,
    textAlign: "center",
    borderWidth: 2,
    borderColor: "lightblue",
  },
  addContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 20,
    marginBottom: 50,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    backgroundColor: "white",
    elevation: 6,
    padding:12
  },
  notes: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
});
