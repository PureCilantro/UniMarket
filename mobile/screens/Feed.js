import { useState, useEffect } from 'react';
import { Text, ActivityIndicator, useTheme } from 'react-native-paper';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import Icon from '@expo/vector-icons/Feather';
import axios from 'axios';

import { api, getToken } from '../config/api';
import UniCard from '../components/UniCard';

export default function Feed({ navigation }) {
    // Theme
    const { colors } = useTheme();
    // State variables
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [end, setEnd] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState(['']);
    const [postIDs, setPostIDs] = useState([]);
    const [posts, setPosts] = useState([]);
    
    const getCategories = async () => {
        try {
            const token = await getToken();
            const config = {
                headers: { authorization: `Bearer ${token}` },
            }
            const { data } = await axios.get(api + 'content/getCategories', { headers: config.headers });
            setCategories(data);
        } catch (error) {
            console.error(error);
        }
    };

    const getPostIDs = async () => {
        try {
            setFetching(true);
            const token = await getToken();
            const config = { 
                headers: { 
                    authorization: `Bearer ${token}`,
                    time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }).replace(':', ''),
                    categories: selectedCategories,
                }
            };
            const result = await axios.get(api + 'content/getPostIDs', { headers: config.headers });
            if (result.data.length > 0) {
                const shuffled = result.data.sort(() => Math.random() - 0.5);
                const IDs = shuffled.map(item => (item.postID ));
                setPostIDs(IDs);
            }
            setFetching(false);
        } catch (error) {
            console.error(error);
        }
    };

    const getPosts = async () => {
        try {
            setFetching(true);
            const token = await getToken();
            const config = {
                headers: { authorization: `Bearer ${token}` }
            };
            const IDs = postIDs.slice(0, 5);
            for (let i = 0; i < IDs.length; i++) {
                const { data } = await axios.get(api + 'content/getPostInfo', { headers: { ...config.headers, postID: IDs[i] } });
                setPosts(prevPosts => [...prevPosts, data]);
                setPostIDs(prevIDs => prevIDs.filter(id => id !== IDs[i]));
            }
            if (postIDs.length === 0) {
                setEnd(true);
            }
            setFetching(false);
        } catch (error) {
            console.error(error);
        }
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
    };

    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    const renderItem = ({ item }) => (
        <UniCard
            item={item}
            onPress={() => handlePressCard(item)}
        />
    );

    const renderLoading = () => (
        loading ? (
            <View>
                <ActivityIndicator size="large" color={colors.tertiary || colors.primary} />
            </View>
        ) : null
    );

    const renderEnd = () => (
        end ? (
            <View style={styles.endContainer}>
                <Text style={{ color: colors.outline }}>No hay más publicaciones</Text>
            </View>
        ) : null
    );

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            await getCategories();
            await getPostIDs();
            while (fetching) {
                await sleep(1000);
            }
            await getPosts();
            setLoading(false);
        };
        fetchPosts();
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <View style={styles.iconContainer}>
                <Icon
                    name='search'
                    size={24}
                    color={colors.tertiary || colors.primary}
                    padding={10}
                    onPress={() => {}}
                />
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
                    ListFooterComponent={() => (
                        <>
                            {renderLoading()}
                            {renderEnd()}
                        </>
                    )}
                    onEndReached={getPosts}
                    onEndReachedThreshold={0}
                    refreshControl={
                        <RefreshControl
                            refreshing={refresh}
                            onRefresh={async () => {
                                setRefresh(true);
                                setPosts([]);
                                setPostIDs([]);
                                setEnd(false);
                                await getPostIDs();
                                while (fetching) {
                                    await sleep(100);
                                }
                                await getPosts();
                                setRefresh(false);
                            }}
                        />
                    }
                />
            </View>
        </View>
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
    endContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    },
});