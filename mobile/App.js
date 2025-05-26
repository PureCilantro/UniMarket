import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme, PaperProvider, PaperDefaultTheme, PaperDarkTheme } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

import LoginScreen from './screens/Login';
import RegisterScreen from './screens/Register';
import FeedScreen from './screens/Feed';
import InboxScreen from './screens/Inbox';
import UserPostsScreen from './screens/UserPosts';
import PostDetailScreen from './screens/PostDetails';
import EditPostScreen from './screens/EditPost';
import SettingsScreen from './screens/Settings';
import CreatePostScreen from './screens/CreatePost';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = ({ theme }) => {
    const { colors } = useTheme();
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
                tabBarActiveTintColor: colors.tertiary,
                tabBarInactiveTintColor: colors.outline,
                tabBarStyle: { backgroundColor: colors.background },
            })}
        >
            <Tab.Screen name="Feed" component={FeedScreen} options={{headerShown: false}} />
            <Tab.Screen name="Posts" component={UserPostsScreen} options={{headerShown: false}}  />
            <Tab.Screen name="Inbox" component={InboxScreen} options={{headerShown: false}} />
        </Tab.Navigator>
    );
}

export default function App() {
    const [theme, setTheme] = useState('light');
    const navigationTheme = theme === 'light' ? PaperDefaultTheme : PaperDarkTheme;

    return (
        <SafeAreaProvider>
            <PaperProvider theme={navigationTheme}>
                <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
                    <NavigationContainer theme={navigationTheme}>
                        <Stack.Navigator initialRouteName='Login'>
                            <Stack.Screen name="HomeTabs" options={{headerShown: false}}>
                                {() => <TabNavigator theme={theme} />}
                            </Stack.Screen>
                            <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
                            <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown: false}} />
                            <Stack.Screen name="FeedScreen" component={FeedScreen} options={{headerShown: false}} />
                            <Stack.Screen name="InboxScreen" component={InboxScreen} options={{headerShown: false}} />
                            <Stack.Screen name="UserPostsScreen" component={UserPostsScreen} options={{headerShown: false}} />
                            <Stack.Screen name="PostDetailScreen" component={PostDetailScreen} options={{headerShown: false}} />
                            <Stack.Screen name="EditPostScreen" component={EditPostScreen} options={{headerShown: false}} />
                            <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{headerShown: false}} /> 
                            <Stack.Screen name="CreatePostScreen" component={CreatePostScreen} options={{headerShown: false}} />
                        </Stack.Navigator>
                    </NavigationContainer>
                </SafeAreaView>
            </PaperProvider>  
        </SafeAreaProvider>
    );
}