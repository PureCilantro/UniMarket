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

export default function ContentScreen({ navigation }) {
    //Contexto de tema
    const {theme} = useContext(ThemeContext);
    let activeColors = colors[theme.mode];
    //Variables de estado
    const [loading, setLoading] = useState(false);
    const [end, setEnd] = useState(false);
    const [lastID, setLastID] = useState(0);
    const [currentPage, setCurrentPage ] = useState(1);
    //Función para traer el contenido
    const [refresh, setRefresh] = useState(false);
    const [posts, setPosts] = useState([]);
    const getPosts = async () => {
        const userID = await AsyncStorage.getItem('userID');
        try {
            if (!end) {
                setLoading(true);
                const token = await axios.post(api + 'login/getToken', { userID: userID });
                const config = { 
                    headers: { authorization: `Bearer ${token.data.message}`},
                    params: { time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }).replace(':', ''), row: lastID }
                };
                const result = await axios.get(api + 'content/getPosts', { headers: config.headers, params: config.params });
                if (result.data.length === 0) {
                    setLoading(false);
                    setEnd(true);
                } else {
                    setPosts([...posts, ...result.data]);
                    setLastID(result.data[result.data.length - 1].postID);
                    setLoading(false);
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

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

    const renderLoading = () => {
        return (
            loading ?
            <View>
                <ActivityIndicator size="large" color={activeColors.tertiary} />
            </View> : null
        );
    }
    const renderEnd = () => {
        return (
            end ?
            <View style={styles.endContainer}>
            <Text style={{color: activeColors.outline}}>No hay más publicaciones</Text>
            </View> : null
        );
    }

    const loadMore = () => {
        setCurrentPage(currentPage + 1);
    }

    const formatTime = (obj) => {
        const time = obj.toString();
        const hour = parseInt(time.substring(0, 2));
        const minute = time.substring(2);
        const period = hour >= 12 ? 'pm' : 'am';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minute} ${period}`;
    };

    useEffect(() => {
        getPosts();
    }, [currentPage]);

    return (
        <ScreenWrapper>
            <View style={styles.iconContainer}>
                <Icon
                    name='search'
                    size={24}
                    color={activeColors.tertiary}
                    padding={10}
                    onPress={() => {
                        
                    }}
                />
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
                    ListFooterComponent={() => (
                        <>
                            {renderLoading()}
                            {renderEnd()}
                        </>
                    )}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0}
                    refreshControl={
                        <RefreshControl
                            refreshing={refresh}
                            onRefresh={() => {
                                setRefresh(true);
                                setPosts([]);
                                setLastID(0);
                                setEnd(false);
                                setCurrentPage(1);
                                setRefresh(false);
                            }}
                        />
                    }
                />
            </View>
        </ScreenWrapper>
    );
}
const styles = StyleSheet.create({
    iconContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between',
        paddingHorizontal: 10
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 5,
    },
    card: {
        margin: 10,
        height: 400
    },
    endContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    },
});