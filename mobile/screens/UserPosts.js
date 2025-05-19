import React, { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, Card, FAB, Switch, Button, ActivityIndicator, useTheme } from 'react-native-paper';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from '@expo/vector-icons/Feather';
import axios from 'axios';

import { api, getToken } from '../config/api';
import UniUserCard from '../components/UniUserCard';

export default function UserPosts({ navigation }) {
    // Theme
    const { colors } = useTheme();
    // State variables
    const [posts, setPosts] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [switchToggle, setSwitchToggle] = useState(false);

    const fetchPosts = async () => {
        const token = await getToken();
        try {
            const config = { 
                headers: { authorization: `Bearer ${token}` },
                params: { userID: userID }
            };
            const { data } = await axios.get(api + 'content/getUserPosts', { headers: config.headers, params: config.params });
            setPosts(data);
        } catch (error) {
            console.error(error);
        }
    };

    const toggleActive = async (postID) => {
        const token = await getToken();
        setSwitchToggle(true);
        try {
            const config = { 
                headers: { authorization: `Bearer ${token}` },
            };
            await axios.post(api + 'create/togglePost', {postID: postID}, { headers: config.headers });
            setSwitchToggle(false);
            fetchPosts();
        } catch (error) {
            console.error(error);
        }
    }

    useFocusEffect(
        useCallback(() => {
            fetchPosts();
        }, [])
    );

    const renderItem = ({ item }) => {
        return (
            <UniUserCard
                item={item}
                onEdit={() => handleEditCard(item)}
                onToggleActive={() => toggleActive(item.postID)}
                switchToggle={switchToggle}
                onPress={() => handlePressCard(item)}
            />
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
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <View style={styles.iconContainer}>
                <Icon
                    name={'settings'}
                    size={24}
                    color={colors.tertiary || colors.primary}
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
                style={[styles.fabStyle, { backgroundColor: colors.tertiary || colors.primary }]}
                icon="plus"
                color={colors.onTertiary || colors.onPrimary}
                onPress={() => navigation.navigate('CreatePostScreen')}
            />
        </View>
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