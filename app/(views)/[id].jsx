import { StyleSheet, Text, View,Image } from "react-native";
import React,{useContext} from "react";
import { useLocalSearchParams } from "expo-router";
import { AppContext } from "../context/AppContext";

const ViewIamge = () => {
  const { token, website, setToken } = useContext(AppContext);
  const { id } = useLocalSearchParams();
  return (
    <View style={{flex:1,backgroundColor:"white",alignItems:"center",justifyContent:"center"}}>
      <Image style={{width:"100%",height:600}} source={{uri:
        website+"/storage/images/"+id}} />
    </View>
  );
};

export default ViewIamge;

const styles = StyleSheet.create({});
