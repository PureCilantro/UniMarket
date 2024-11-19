import React, { useState, useContext, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, Card, FAB, Switch, Button} from 'react-native-paper';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
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

    const toggleActive = async (postID) => {
        const userID = await AsyncStorage.getItem('userID');
        try {
            const token = await axios.post(api + 'login/getToken', { userID: userID });
            const config = { 
                headers: { authorization: `Bearer ${token.data.message}` },
            };
            await axios.post(api + 'content/togglePost', {postID: postID, userID: userID}, { headers: config.headers });
            fetchPosts();
        } catch (error) {
            console.error(error);
        }
    }

    const formatTime = (obj) => {
        const time = obj.toString();
        const hour = parseInt(time.substring(0, 2));
        const minute = time.substring(2);
        const period = hour >= 12 ? 'pm' : 'am';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minute} ${period}`;
    };

    useFocusEffect(
        useCallback(() => {
            fetchPosts();
        }, [])
    );

    const renderItem = ({ item }) => {
        return (
            <Card style={styles.card} onPress={() => handlePressCard(item)}>
                <Card.Title title={item.title} />
                <Card.Content>
                    <Text>{item.description}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{color:activeColors.outline}}>Desde: </Text>
                            <Text>{formatTime(item.availableFrom)}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{color:activeColors.outline}}>Precio: </Text>
                            <Text>{`$${item.price.toLocaleString()}`}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{color:activeColors.outline}}>Hasta: </Text>
                            <Text>{formatTime(item.availableTo)}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{color:activeColors.outline}}>Cantidad: </Text>
                            <Text>{item.quantity}</Text>
                        </View>
                    </View>
                </Card.Content>
                <Card.Actions>
                    <Button 
                        mode='elevated'
                        style={{ backgroundColor: activeColors.tertiary}}
                        onPress={() => handleEditCard(item)}
                    >
                        <Text style={{ color: activeColors.onTertiary }}>Editar</Text>
                    </Button>
                    <Text style={{ color: activeColors.outline }}>  Activo</Text>
                    <Switch value={item.active === 1} onValueChange={() => {toggleActive(item.postID)}} color={activeColors.tertiary}/>
                </Card.Actions>
            </Card>
        );
    };

    const handleEditCard = (item) => {
        navigation.navigate('EditPostScreen', { 
            postID: item.postID,
            pTitle: item.title,
            pDescription: item.description,
            pPrice: item.price,
            pQuantity: item.quantity,
            pAvailableTo: item.availableTo,
            pAvailableFrom: item.availableFrom,
        });
    }

    const handlePressCard = (item) => {
        navigation.navigate('PostDetailScreen', { 
            postID: item.postID,
            title: item.title,
            description: item.description,
            price: item.price,
            quantity: item.quantity,
            images: item.images,
            available: item.availableTo,
            active: item.active
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
            <FAB
                label='Crear publicación'
                style={[styles.fabStyle, { backgroundColor: activeColors.tertiary }]}
                icon="plus"
                color={activeColors.onTertiary}
                onPress={() => navigation.navigate('CreatePostScreen')}
            />
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