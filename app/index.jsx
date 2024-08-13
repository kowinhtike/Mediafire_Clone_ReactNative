import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button,StyleSheet,TouchableOpacity } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { router } from "expo-router";
import axios from "axios";
import { AppContext } from "./context/AppContext";

export default function index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { token, website, user, setToken, setUser } = useContext(AppContext);

  const login = async (email, password) => {
    try {
      const response = await axios.post(website + "/api/login", {
        email,
        password,
      });
      const { token, user } = response.data;
      setToken(token);
      setUser(user);
    } catch (error) {
      console.error("Login error", error);
      // Handle error (e.g., invalid credentials)
    }
  };

  const handleLogin = () => {
    login(email, password);
  };

  return (
    <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Welcome Back</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin} >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.forgotPassword} onPress={()=>{
            router.push('register')
          }}>Don't have an account?</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  formContainer: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#3b5998',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
});

