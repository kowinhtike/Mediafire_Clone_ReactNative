import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [token, setToken] = useState(null); // Initialize with null or a default value
  const [user, setUser] = useState({});
  const [website,setWebsite] = useState("http://192.168.1.8/laravel/mediafire-clone/mediafire-clone/public")

  // Retrieve token from AsyncStorage when the app loads
  useEffect(() => {
    const loadToken = async () => {
      try {
        const savedToken = await AsyncStorage.getItem('userToken');
        if (savedToken) {
          setToken(savedToken);
        }
      } catch (error) {
        console.error('Failed to load token', error);
      }
    };
    const loadUser = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Failed to load token', error);
      }
    };
    loadToken();
    loadUser();
  }, []);

  // Save token to AsyncStorage whenever it changes
  useEffect(() => {
    const saveToken = async () => {
      try {
        if (token) {
          await AsyncStorage.setItem('userToken', token);
          router.replace("/home")
        } else {
          await AsyncStorage.removeItem('userToken'); // Remove token if null
          router.replace("/")
        }
      } catch (error) {
        console.error('Failed to save token', error);
      }
    };
    saveToken();
  }, [token]);

  // Save userdata to AsyncStorage whenever it changes
  useEffect(() => {
    const saveToken = async () => {
      try {
        if (user) {
          await AsyncStorage.setItem('user', JSON.stringify(user));
        } else {
          await AsyncStorage.removeItem('user'); // Remove token if null
        }
      } catch (error) {
        console.error('Failed to save token', error);
      }
    };
    saveToken();
  }, [user]);

  return (
    <AppContext.Provider value={{ token, website, user, setToken, setUser }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
