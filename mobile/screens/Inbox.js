import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import axios from 'axios';
import { Text, useTheme } from 'react-native-paper';

import { api, getToken } from '../config/api';

export default function Inbox() {
    const { colors } = useTheme();

    const test = async () => {
        try {
            const token = await getToken();
            console.log(token);
            const config = {
                headers: { authorization: `Bearer ${token}` },
            };
            const { data } = await axios.get(api + 'content/getCategories', { headers: config.headers });
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        test();
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.title, { color: colors.tertiary || colors.primary }]}>
                Work in progress
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 16,
        marginBottom: 100,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        marginTop: 16,
        textAlign: 'center',
    },
});