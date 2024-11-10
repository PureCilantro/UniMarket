import React, { useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { ScreenWrapper} from './ScreenWrapper';
import Icon from '@expo/vector-icons/Feather';
import { colors } from '../theme/colors';
import { ThemeContext } from '../contexts/ThemeContext';

export default function LoginScreen({ navigation }) {
    //Contexto de tema
    const {theme} = useContext(ThemeContext);
    let activeColors = colors[theme.mode];

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
                    
            </View>
        </ScreenWrapper>
    );
}
const styles = StyleSheet.create({
    iconContainer: {
        flexDirection: 'row', 
        justifyContent: 'flex-end'
    },container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
});