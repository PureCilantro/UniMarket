import { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, Button, TextInput, HelperText, Portal, Dialog, useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import { api } from '../config/api';
import UniText from '../components/UniText';

export default function Login({ navigation }) {
    // Theme
    const { colors, dark } = useTheme();
    // State variables
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    // Error variables
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(true);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [credentialsError, setCredentialsError] = useState(false);
    const toggleDialog = () => setDialogVisible(!dialogVisible);
    const toggleCredentialsError = () => setCredentialsError(!credentialsError);
    const emailRegex = new RegExp('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$');

    const handleLogin = async () => {
        email === '' ? setEmailError(true) : setEmailError(false);
        password === '' ? setPasswordError(true) : setPasswordError(false);
        if (email && password) {
            if (!emailRegex.test(email)) {
                setDialogVisible(true);
                return;
            }
            setLoading(true);
            try {
                const response = await axios.post(api + 'login', { email: email.toLowerCase(), password });
                if (response.status === 200) {
                    await AsyncStorage.setItem('userID', response.data.userID);
                    await AsyncStorage.setItem('userKey', response.data.userKey);
                    navigation.replace('HomeTabs');
                }
            } catch (error) {
                setCredentialsError(true);
                setLoading(false);
                console.error(error);
            }
        }
    };

    useEffect(() => {
        const checkLogin = async () => {
            const userKey = await AsyncStorage.getItem('userKey');
            if (userKey) {
                navigation.replace('HomeTabs');
            }
        };
        checkLogin();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: colors.tertiary || colors.primary }]}>Ingresa</Text>
            <UniText
                label="Correo"
                placeholder="Ingresa tu correo institucional"
                value={email}
                onChangeText={(email) => {
                    setEmail(email);
                    setEmailError(false);
                }}
                onBlur={() => {
                    if (!emailRegex.test(email)) {
                        setEmailError(true);
                    }
                }}
                textContentType='emailAddress'
                autoCapitalize='none'
            />
            <HelperText type='error' padding='none' visible={emailError}>
                Ingresa un correo válido
            </HelperText>
            <UniText
                label="Contraseña"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChangeText={(pass) => {
                    setPassword(pass);
                    setPasswordError(false);
                }}
                textContentType='password'
                autoCapitalize='none'
                secureTextEntry={passwordVisible}
                right={
                    <TextInput.Icon
                        icon={passwordVisible ? 'eye-off' : 'eye'}
                        color={colors.tertiary || colors.primary}
                        onPress={() => setPasswordVisible(!passwordVisible)}
                    />
                }
            />
            <HelperText type='error' padding='none' visible={passwordError}>
                Ingresa una contraseña
            </HelperText>
            <Button
                mode="elevated"
                style={[styles.button, { backgroundColor: colors.tertiary || colors.primary }]}
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? <ActivityIndicator size={'small'} color={colors.onTertiary || colors.onPrimary} /> : <Text style={[styles.text, { color: colors.onTertiary || colors.onPrimary }]}>Ingresar</Text>}
            </Button>
            <Text style={[styles.text, { color: colors.outline, padding: 15 }]}>
                ¿No tienes cuenta?{' '}
                <Text style={{ color: colors.primary }} onPress={() => navigation.navigate('Register')}>
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
        fontSize: 30,
        marginBottom: 16,
        textAlign: 'center',
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