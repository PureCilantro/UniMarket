import React, { useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, Card, ActivityIndicator} from 'react-native-paper';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import Icon from '@expo/vector-icons/Feather';
import axios from 'axios';

import { colors } from '../theme/colors';
import { ThemeContext } from '../contexts/ThemeContext';
import { ScreenWrapper} from './ScreenWrapper';
import { api } from '../config/api';

export default function PostsScreen({ navigation }) {
    //Contexto de tema
    const {theme} = useContext(ThemeContext);
    let activeColors = colors[theme.mode];
    //Variables de estado
    const [posts, setPosts] = useState([]);
    const [refresh, setRefresh] = useState(false);

    const fetchPosts = async () => {
        const userID = await AsyncStorage.getItem('userID');
        try {
            const token = await axios.post(api + 'login/getToken', { userID: userID });
            const config = { 
                headers: { authorization: `Bearer ${token.data.message}` },
                params: { userID: userID }
            };
            const result = await axios.get(api + 'content/getUserPosts', { headers: config.headers, params: config.params });
            setPosts(result.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const renderItem = ({ item }) => {
        return (
            <Card style={styles.card} onPress={() => handlePressCard(item)}>
                <Card.Title title={item.title} />
                <Card.Content>
                    <Text>{item.description}</Text>
                    <Text>{item.price}</Text>
                </Card.Content>
            </Card>
        );
    };

    const handlePressCard = (item) => {
        navigation.navigate('PostDetailScreen', { 
            postID: item.postID,
            title: item.title,
            description: item.description,
            price: item.price,
            quantity: item.quantity,
            images: item.images,
            available: item.availableTo
        });
    }

    return (
        <ScreenWrapper>
            <View style={styles.iconContainer}>
                <Icon                                  //Icono de configuración
                    name={'settings'}
                    size={24}
                    color={activeColors.tertiary}
                    padding={10}
                    onPress={() => {
                        navigation.navigate('SettingsScreen');
                    }}
                />
            </View>
            <View style={styles.container}>
                <FlatList
                    data={posts}
                    renderItem={renderItem}
                    keyExtractor={item => item.postID}
                    refreshControl={
                        <RefreshControl
                            refreshing={refresh}
                            onRefresh={() => {
                                setRefresh(true);
                                setPosts([]);
                                fetchPosts();
                                setRefresh(false);
                            }}
                        />
                    }
                />
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    iconContainer: {
        flexDirection: 'row', 
        justifyContent: 'flex-end'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 5,
    },
    card: {
        margin: 10,
        height: 200
    },
    endContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    },
    fabStyle: {
        bottom: 20,
        right: 20,
        position: 'absolute',
    },
});