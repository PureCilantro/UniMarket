import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from '@expo/vector-icons/Feather';

export default function PostDetail({ navigation, route }) {
    // Variables de estado
    const { postID, title, description, price, quantity, images, available } = route.params;
    // Usar el tema de react-native-paper
    const { colors } = useTheme();

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <View style={styles.rowContainer}>
                <Icon
                    name={'arrow-left'}
                    size={24}
                    color={colors.tertiary || colors.primary}
                    padding={10}
                    onPress={() => { navigation.goBack() }}
                />                
            </View>
            <View style={styles.rowContainer}>
                <Text style={[styles.title, { color: colors.tertiary || colors.primary }]}>{title}</Text>
            </View>
            <View style={styles.container}>
                {/* TODO */}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row', 
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
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