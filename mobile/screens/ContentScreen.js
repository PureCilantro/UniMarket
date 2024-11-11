import React, { useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Text, Card, ActivityIndicator } from 'react-native-paper';
import { View, StyleSheet, FlatList } from 'react-native';
import Icon from '@expo/vector-icons/Feather';
import axios from 'axios';

import { colors } from '../theme/colors';
import { ThemeContext } from '../contexts/ThemeContext';
import { ScreenWrapper} from './ScreenWrapper';
import { api } from '../config/api';

export default function LoginScreen({ navigation }) {
    //Contexto de tema
    const {theme} = useContext(ThemeContext);
    let activeColors = colors[theme.mode];
    //Variables de estado
    const [loading, setLoading] = useState(false);
    const [end, setEnd] = useState(false);
    const [lastID, setLastID] = useState(0);
    const [currentPage, setCurrentPage ] = useState(1);
    //Función para traer el contenido
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
            <Card style={styles.card}>
                <Card.Title title={item.title} />
                <Card.Content>
                    <Text>{item.description}</Text>
                    <Text>{item.price}</Text>
                </Card.Content>
            </Card>
        );
    };

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

    useEffect(() => {
        getPosts();
    }, [currentPage]);

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
                    ListFooterComponent={() => (
                        <>
                            {renderLoading()}
                            {renderEnd()}
                        </>
                    )}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0}
                />
            </View>
        </ScreenWrapper>
    );
}
const styles = StyleSheet.create({
    iconContainer: {
        flexDirection: 'row', 
        justifyContent: 'flex-end'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 12,
    },
    card: {
        margin: 10,
        height: 200
    },
    endContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    }
});