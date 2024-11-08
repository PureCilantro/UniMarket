import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useState } from 'react';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ContentScreen from './screens/ContentScreen';

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
          <Stack.Screen name="Home" component={ContentScreen} options={{headerShown: false}} />
        </Stack.Navigator>
      </ThemeContext.Provider>
    </NavigationContainer>    
  );
}
