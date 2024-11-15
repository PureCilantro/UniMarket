import React, { useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, TextInput, HelperText, Portal, Dialog } from 'react-native-paper';
import Icon from '@expo/vector-icons/Feather';

import { ScreenWrapper} from './ScreenWrapper';
import { colors } from '../theme/colors';
import { ThemeContext } from '../contexts/ThemeContext';

export default function PostDetailScreen({ navigation, route }) {
    //Variables de estado
    const {postID, title, description, price, quantity, images, available} = route.params;
    //Contexto de tema
    const {theme, toggleTheme} = useContext(ThemeContext);
    let activeColors = colors[theme.mode];

    return (
        <ScreenWrapper>
            <View style={styles.rowContainer}>
                <Icon
                    name={'arrow-left'}
                    size={24}
                    color={activeColors.tertiary}
                    padding={10}
                    onPress={() => { navigation.goBack() }}
                />                
            </View>
            <View styles={styles.rowContainer}>
                <Text style={[styles.title, { color: activeColors.tertiary }]}>{title}</Text>
            </View>
            <View style={styles.container}>
                {/* TODO */}
            </View>
        </ScreenWrapper>
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