import React, { useState, useContext, useEffect } from 'react';
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
    const [isLoggedIn, setIsLoggedIn] = useState(false);
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

    useEffect(() => {
        const checkLogin = async () => {
            const userID = await AsyncStorage.getItem('userID');
            if (userID) {
                navigation.replace('ContentScreen');
            }
        };
        checkLogin();
    }, []);

    return (
        <ScreenWrapper>
            <View style={styles.iconContainer}>
                <Icon                                  //Icono de sol o luna para cambiar el tema
                    name={theme.mode === 'light' ? 'sun' : 'moon'}
                    size={24}
                    color={activeColors.tertiary}
                    padding={10}
                    onPress={() => {
                        toggleTheme();
                    }}
                />
            </View>
            <View style={styles.container}>
                <Text style={[styles.title, { color: activeColors.tertiary }]}>Ingresa</Text>
                <TextInput                                                 //Input para correo
                    label="Correo"
                    style={styles.input}
                    placeholder="Ingresa tu correo institucional"
                    placeholderTextColor={activeColors.outline}
                    value={email}
                    onChangeText={(email) => {
                        setEmail(email);
                        setEmailError(false);
                    }}
                    activeUnderlineColor={activeColors.tertiary}
                    textColor={activeColors.onBackground}
                    textContentType='emailAddress'
                />
                <HelperText type='error' padding='none' visible={emailError}>
                    Ingresa un correo
                </HelperText>
                <TextInput                                                 //Input para contraseña
                    label="Contraseña"
                    style={styles.input}
                    placeholder="Ingresa tu contraseña"
                    placeholderTextColor={activeColors.outline}
                    value={password}
                    onChangeText={(pass) => {
                        setPassword(pass);
                        setPasswordError(false);
                    }}
                    secureTextEntry={passwordVisible}
                    activeUnderlineColor={activeColors.tertiary}
                    textColor={activeColors.onBackground}
                    textContentType='password'
                    autoCapitalize='none'
                    right={
                        <TextInput.Icon
                            icon={passwordVisible ? 'eye-off' : 'eye'}
                            color={activeColors.tertiary}
                            onPress={() => setPasswordVisible(!passwordVisible)}
                        />
                    }
                />
                <HelperText type='error' padding='none' visible={passwordError}>
                    Ingresa una contraseña
                </HelperText>
                <Button                                                    //Botón para iniciar sesión
                    mode="elevated"
                    style={[styles.button,{backgroundColor: activeColors.tertiary}]}
                    onPress={handleLogin} 
                    disabled={loading}
                >
                    {loading ? <ActivityIndicator size={'small'} color={activeColors.onTertiary} /> : <Text style={[styles.text, {color: activeColors.onTertiary}]}>Ingresar</Text>}
                </Button>
                <Text style={[styles.text, {color: activeColors.outline, padding:15}]}>
                    ¿No tienes cuenta?{' '}
                    <Text style={{color: activeColors.primary}} onPress={() => navigation.navigate('Register')}>
                        Regístrate
                    </Text>
                </Text>
                <Portal>
                    <Dialog visible={dialogVisible} onDismiss={toggleDialog}>
                        <Dialog.Title>Error</Dialog.Title>
                        <Dialog.Content>
                            <Text variant="bodyMedium">Ingresa un correo válido</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={toggleDialog}>Ok</Button>
                        </Dialog.Actions>
                    </Dialog>
                    <Dialog visible={credentialsError} onDismiss={toggleCredentialsError}>
                        <Dialog.Title>Error</Dialog.Title>
                        <Dialog.Content>
                            <Text variant="bodyMedium">Credenciales incorrectas</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={toggleCredentialsError}>Ok</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
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
        paddingHorizontal: 16,
        marginBottom: 100,
    },
    title: {
        fontSize: 30,
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        backgroundColor: 'transparent',
        paddingHorizontal: 0,
        marginTop: 10,
        fontSize: 16,
    },
    button: {
        fontSize: 16,
        marginTop: 30,
        alignSelf: 'center',
        width: '90%',
    },
    text: {
        fontSize: 16,
        textAlign: 'center'
    },
});