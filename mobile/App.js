import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useContext } from 'react';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ContentScreen from './screens/ContentScreen';
import SettingsScreen from './screens/SettingsScreen';
import PostDetailScreen from './screens/PostDetailScreen';
import CreatePostScreen from './screens/CreatePostScreen';
import InboxScreen from './screens/InboxScreen';
import PostsScreen from './screens/PostsScreen';
import EditPostScreen from './screens/EditPostScreen';

import { colors } from './theme/colors';
import { ThemeContext } from './contexts/ThemeContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const {theme, toggleTheme} = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Feed') {
            iconName = focused ? 'albums' : 'albums-outline';
          } else if (route.name === 'Posts') {
            iconName = focused ? 'newspaper' : 'newspaper-outline';
          } else if (route.name === 'Inbox') {
            iconName = focused ? 'mail' : 'mail-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: activeColors.tertiary,
        tabBarInactiveTintColor: activeColors.outline,
        tabBarStyle: { 
          backgroundColor: activeColors.background,
        },
      })}
    >
      <Tab.Screen name="Feed" component={ContentScreen} options={{headerShown: false}} />
      <Tab.Screen name="Posts" component={PostsScreen} options={{headerShown: false}}  />
      <Tab.Screen name="Inbox" component={InboxScreen} options={{headerShown: false}} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [theme, setTheme] = useState({mode: 'light'});

  const toggleTheme = () => {
    setTheme({mode: theme.mode === 'light' ? 'dark' : 'light'});
  };

  return (
    <NavigationContainer>
      <ThemeContext.Provider value={{theme, toggleTheme}}>
        <Stack.Navigator initialRouteName='Login'>
          <Stack.Screen name="HomeTabs" component={TabNavigator} options={{headerShown: false}} />
          <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown: false}} />
          <Stack.Screen name="ContentScreen" component={ContentScreen} options={{headerShown: false}} />
          <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{headerShown: false}} />
          <Stack.Screen name="PostDetailScreen" component={PostDetailScreen} options={{headerShown: false}} />
          <Stack.Screen name="CreatePostScreen" component={CreatePostScreen} options={{headerShown: false}} />
          <Stack.Screen name="EditPostScreen" component={EditPostScreen} options={{headerShown: false}} />
          <Stack.Screen name="InboxScreen" component={InboxScreen} options={{headerShown: false}} />
          <Stack.Screen name="PostsScreen" component={PostsScreen} options={{headerShown: false}} />
        </Stack.Navigator>
      </ThemeContext.Provider>
    </NavigationContainer>    
  );
}
