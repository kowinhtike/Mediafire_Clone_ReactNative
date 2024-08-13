import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import React, { useContext, useEffect, useState, useCallback } from "react";
import { AppContext } from "../context/AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import {
  router,
  useLocalSearchParams,
  useFocusEffect,
  useNavigation,
} from "expo-router";
import * as ImagePicker from "expo-image-picker";

const note = () => {
  const { token, website, setToken } = useContext(AppContext);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(null);
  const [editId, setEditId] = useState(null);
  const { id } = useLocalSearchParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const navigation = useNavigation();



  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            onPress={() => {
              setEditId(null);
              pickImage();
            }}
          >
            <Ionicons name="image" size={30} color="black" />
          </TouchableOpacity>
        ),
      });
    }, [token])
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const response = await fetch(website + `/api/folders/${id}/files`, {
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
    fetchUserData();
  }, [time]); // Fetch data on component mount

  const pickImage = async () => {
    // Request permission to access the media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    // Launch the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [9, 14],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri); // Set the selected image URI
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) return;

    const token = await AsyncStorage.getItem("userToken");

    const formData = new FormData();
    formData.append("image", {
      uri: selectedImage,
      name: "uploaded_image.jpg", // You can dynamically get the name if required
      type: "image/jpeg", // Adjust the type according to the selected image
    });

    try {
      const response = await fetch(website + `/api/folders/${id}/files`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Upload successful:", result);
        setSelectedImage(null);
        setTime(Date.now().toString()); // Refresh the list after upload
      } else {
        console.error("Upload failed:", result);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const destroyData = async (fileId) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(
        website + `/api/folders/${id}/files/${fileId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const userData = await response.json();
      console.log("delete successfully");
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const updateImage = async (fileId) => {
    if (!selectedImage) return;

    const token = await AsyncStorage.getItem("userToken");

    const formData = new FormData();
    formData.append("image", {
      uri: selectedImage,
      name: "uploaded_image.jpg", // You can dynamically get the name if required
      type: "image/jpeg", // Adjust the type according to the selected image
    });

    try {
      const response = await fetch(
        website + `/api/folders/${id}/files/${fileId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // "Content-Type": "multipart/form-data",
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok) {
        console.log("Update successful:", result);
        setSelectedImage(null);
        setTime(Date.now().toString()); // Refresh the list after upload
      } else {
        console.error("Update failed:", result);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      {loading && (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      )}
      <FlatList
        data={folders}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          return (
            <View style={styles.item}>
              <TouchableOpacity
                style={styles.part}
                onPress={() => {
                  router.push("(views)/" + item.file);
                }}
              >
                <Image
                  style={styles.Image}
                  source={{
                    uri: website + "/storage/images/" + item.file,
                  }}
                />
              </TouchableOpacity>
              <View style={styles.crudContainer}>
                <TouchableOpacity style={styles.part}>
                  <Ionicons
                    name="trash"
                    size={30}
                    color="red"
                    onPress={() => {
                      destroyData(item.number);
                      setTime(Date.now().toString());
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.part}
                  onPress={() => {
                    setEditId(item.number);
                    pickImage();
                  }}
                >
                  <Ionicons name="create" size={30} color="gray" />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />

      {selectedImage && (
        <View
          style={{
            backgroundColor: "black",
            padding: 8,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={{ uri: selectedImage }}
            style={{ width: 180, height: 280 }}
          />
          <View
            style={{
              position: "absolute",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                  if(editId === null){
                    uploadImage();
                  }else{
                    updateImage(editId);
                  }
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 20,
                  fontWeight: "700",
                  margin: 20,
                }}
              >
                {editId === null ? "Upload Image" : "Update Image"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSelectedImage(null);
              }}
            >
              <Ionicons size={50} name="close-circle-outline" color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* <View style={styles.addContainer}>
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
            title={editId === "" ? "ADD" : "SUBMIT"}
            onPress={() => {
              if (editId === "") {
                createData(name);
              } else {
                updateData(editId, name);
              }
              setName("");
              setTime(Date.now().toString());
              //refresh
              setEditId("");
            }}
          />
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

export default note;

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
    flex: 1,
  },
  textinput: {
    padding: 8,
    margin: 10,
    width: 100,
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
    elevation: 5,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: 180,
    margin: 5,
  },
  notes: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  crudContainer: { position: "absolute", bottom: 0, right: 0, margin: 8 },
  Image: { width: "100%", height: 300 },
  btnContainer: {
    backgroundColor: "black",
    padding: 15,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    elevation: 6,
  },
});
