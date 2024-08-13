import { Stack } from "expo-router";
import { AppProvider } from "./context/AppContext"
import { View } from "react-native";

export default function RootLayout() {
  return (
    <View style={{flex:1,width:"100%",maxWidth:600,alignSelf:"center"}}>
      <AppProvider>
      <Stack>
        <Stack.Screen name="index" options={{title:"Login",headerShown:false}} />
        <Stack.Screen name="register"  options={{title:"Register"}}/>
        <Stack.Screen name="home" options={{title:"Project List", headerLeft(props) {
            return null
        },}} />
        <Stack.Screen name="(notes)/[id]" options={{title:"Image List"}} />
        <Stack.Screen name="(views)/[id]" options={{title:"Image Viewer"}} />
      </Stack>
    </AppProvider>
    </View>
  );
}
