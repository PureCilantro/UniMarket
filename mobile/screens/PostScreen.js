import React, { useState, useContext } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, Button, TextInput, HelperText, Portal, Dialog } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from '@expo/vector-icons/Feather';
import axios from 'axios';


import { ScreenWrapper} from './ScreenWrapper';
import { colors } from '../theme/colors';
import { ThemeContext } from '../contexts/ThemeContext';
import { api } from '../config/api';

export default function LoginScreen({ navigation }) {
    //Variables de estado
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    //Variables de error
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(true);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [credentialsError, setCredentialsError] = useState(false);
    const toggleDialog = () => setDialogVisible(!dialogVisible);
    const toggleCredentialsError = () => setCredentialsError(!credentialsError);
    //Contexto de tema
    const {theme, toggleTheme} = useContext(ThemeContext);
    let activeColors = colors[theme.mode];
    //Función para manejar el inicio de sesión
    const handleLogin = () => {
        email === '' ? setEmailError(true) : setEmailError(false);
        password === '' ? setPasswordError(true) : setPasswordError(false);
        const emailRegex = new RegExp('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$');
        if (email && password) {
            if (!emailRegex.test(email)) {
                setDialogVisible(true);
            }
            setLoading(true);
            axios.post(api + 'login', body = { email: email.toLowerCase(), password: password})
                .then(async (response) => {
                    if (response.status === 200) {
                        await AsyncStorage.setItem('userID', response.data.message[0].userID);
                        navigation.replace('ContentScreen');
                    } else if (response.status === 401) {
                        setCredentialsError(true);
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

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
                <Text style={[styles.title, { color: activeColors.tertiary }]}>Configuración</Text>
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
        marginLeft: '20%',
    },
});