import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, Switch, Card, Button } from 'react-native-paper';
import axios from 'axios';
import Icon from '@expo/vector-icons/Feather';

import { colors } from '../theme/colors';
import { ThemeContext } from '../contexts/ThemeContext';
import { ScreenWrapper} from './ScreenWrapper';
import { api } from '../config/api';

export default function CreatePostScreen({ navigation }) {
    const [loading, setLoading] = useState(false);
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
                <Text style={[styles.title, { color: activeColors.tertiary }]}>Crear Publicación</Text>
            </View>
            <View style={styles.container}>
                
            </View>
        </ScreenWrapper>
    );
}
const styles = StyleSheet.create({
    container: {
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