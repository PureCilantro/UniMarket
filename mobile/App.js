import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { useState, useEffect } from 'react';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ContentScreen from './screens/ContentScreen';
import SettingsScreen from './screens/SettingsScreen';
import PostDetailScreen from './screens/PostDetailScreen';
import CreatePostScreen from './screens/CreatePostScreen';
import InboxScreen from './screens/InboxScreen';
import PostsScreen from './screens/PostsScreen';

import { ThemeContext } from './contexts/ThemeContext';

const Stack = createNativeStackNavigator();

export default function App() {
  const [theme, setTheme] = useState({mode: 'light'});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleTheme = () => {
    setTheme({mode: theme.mode === 'light' ? 'dark' : 'light'});
  };

  useEffect(() => {
    const checkLogin = async () => {
      const userID = await AsyncStorage.getItem('userID');
      if (userID) {
        setIsLoggedIn(true);
      }
    };
    checkLogin();
  }, []);

  return (
    <NavigationContainer>
      <ThemeContext.Provider value={{theme, toggleTheme}}>
        <Stack.Navigator initialRouteName={isLoggedIn ? 'ContentScreen' : 'Login'}>
          <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown: false}} />
          <Stack.Screen name="ContentScreen" component={ContentScreen} options={{headerShown: false}} />
          <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{headerShown: false}} />
          <Stack.Screen name="PostDetailScreen" component={PostDetailScreen} options={{headerShown: false}} />
          <Stack.Screen name="CreatePostScreen" component={CreatePostScreen} options={{headerShown: false}} />
          <Stack.Screen name="InboxScreen" component={InboxScreen} options={{headerShown: false}} />
          <Stack.Screen name="PostsScreen" component={PostsScreen} options={{headerShown: false}} />
        </Stack.Navigator>
      </ThemeContext.Provider>
    </NavigationContainer>    
  );
}
