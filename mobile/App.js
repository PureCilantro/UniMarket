import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useState } from 'react';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ContentScreen from './screens/ContentScreen';
import SettingsScreen from './screens/SettingsScreen';
import PostScreen from './screens/PostScreen';
import CreatePostScreen from './screens/CreatePostScreen';

import { ThemeContext } from './contexts/ThemeContext';

const Stack = createNativeStackNavigator();

export default function App() {
  const [theme, setTheme] = useState({mode: 'light'});

  const toggleTheme = () => {
    setTheme({mode: theme.mode === 'light' ? 'dark' : 'light'});
  };

  return (
    <NavigationContainer>
      <ThemeContext.Provider value={{theme, toggleTheme}}>
        <Stack.Navigator initialRouteName='Login'>
          <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown: false}} />
          <Stack.Screen name="ContentScreen" component={ContentScreen} options={{headerShown: false}} />
          <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{headerShown: false}} />
          <Stack.Screen name="PostScreen" component={PostScreen} options={{headerShown: false}} />
          <Stack.Screen name="CreatePostScreen" component={CreatePostScreen} options={{headerShown: false}} />
        </Stack.Navigator>
      </ThemeContext.Provider>
    </NavigationContainer>    
  );
}
